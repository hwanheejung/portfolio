import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";
import type { ZodType } from "zod";

import {
  type ArticleCategoryId,
  articleCategoryIds,
  ArticleMetadataSchema,
  type ArticleSummary,
  isPublishedArticleComplete,
} from "../../../schema/article";
import { type About, AboutSchema } from "../../../schema/about";
import { type Experience, ExperienceSchema } from "../../../schema/experience";
import { type Placements, PlacementSchema } from "../../../schema/placement";
import { type Taxonomy, TaxonomySchema } from "../../../schema/taxonomy";

import { resolveContentAssetPath, resolveContentAssetUrl } from "./assets";
import { parseMdxDocument } from "./frontmatter";

const PROJECT_ROOT = process.cwd();
const CONTENT_ROOT = path.join(PROJECT_ROOT, "content");
const ARTICLES_ROOT = path.join(CONTENT_ROOT, "articles");
const EXPERIENCES_ROOT = path.join(CONTENT_ROOT, "experiences");
const ABOUT_ROOT = path.join(CONTENT_ROOT, "about");

const ALLOWED_MDX_COMPONENTS = new Set([
  "Callout",
  "Chart",
  "Column",
  "Columns",
  "Figure",
  "Metric",
  "Numbering",
  "PointGrid",
  "SectionHeading",
]);

export type ContentIssue = {
  file: string;
  message: string;
};

export type ContentSnapshot = {
  articles: ArticleSummary[];
  experiences: Experience[];
  about: About;
  taxonomy: Taxonomy;
  placements: Placements;
};

export class ContentValidationError extends Error {
  constructor(public readonly issues: ContentIssue[]) {
    super(
      [
        "Content validation failed:",
        ...issues.map((issue) => `- ${issue.file}: ${issue.message}`),
      ].join("\n")
    );
    this.name = "ContentValidationError";
  }
}

async function directoryNames(directory: string) {
  const entries = await readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
}

async function readYamlFile<T>(
  filePath: string,
  schema: ZodType<T>,
  issues: ContentIssue[]
): Promise<T | null> {
  try {
    const source = await readFile(filePath, "utf8");
    const parsed = YAML.parse(source);
    const result = schema.safeParse(parsed);

    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          file: path.relative(PROJECT_ROOT, filePath),
          message: `${issue.path.join(".") || "root"}: ${issue.message}`,
        });
      }
      return null;
    }

    return result.data;
  } catch (error) {
    issues.push({
      file: path.relative(PROJECT_ROOT, filePath),
      message: error instanceof Error ? error.message : "Unable to read file.",
    });
    return null;
  }
}

async function assetExists(
  directory: string,
  assetPath: string,
  file: string,
  issues: ContentIssue[]
) {
  const resolved = resolveContentAssetPath(directory, assetPath);

  if (!resolved) {
    issues.push({
      file,
      message: `Asset "${assetPath}" must be inside ./images/.`,
    });
    return;
  }

  try {
    await access(resolved);
  } catch {
    issues.push({
      file,
      message: `Asset "${assetPath}" does not exist.`,
    });
  }
}

function validateMdxBody(body: string, file: string, issues: ContentIssue[]) {
  const proseOnly = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");

  if (/^\s*(?:import|export)\s/m.test(proseOnly)) {
    issues.push({
      file,
      message: "MDX imports and exports are not allowed in article content.",
    });
  }

  const componentMatches = proseOnly.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g);
  for (const match of componentMatches) {
    const component = match[1];
    if (component && !ALLOWED_MDX_COMPONENTS.has(component)) {
      issues.push({
        file,
        message: `Unknown MDX component <${component}>.`,
      });
    }
  }
}

async function readArticles(issues: ContentIssue[]) {
  const articles: ArticleSummary[] = [];
  let articleDirectories: string[] = [];

  try {
    articleDirectories = await directoryNames(ARTICLES_ROOT);
  } catch (error) {
    issues.push({
      file: "content/articles",
      message:
        error instanceof Error ? error.message : "Unable to read directory.",
    });
    return articles;
  }

  for (const folderName of articleDirectories) {
    const articleDirectory = path.join(ARTICLES_ROOT, folderName);
    const articleFile = path.join(articleDirectory, "index.mdx");
    const relativeFile = path.relative(PROJECT_ROOT, articleFile);

    try {
      const source = await readFile(articleFile, "utf8");
      const document = parseMdxDocument(source);
      const result = ArticleMetadataSchema.safeParse(document.data);

      if (!result.success) {
        for (const issue of result.error.issues) {
          issues.push({
            file: relativeFile,
            message: `${issue.path.join(".") || "frontmatter"}: ${
              issue.message
            }`,
          });
        }
        continue;
      }

      const metadata = result.data;

      if (folderName !== metadata.slug) {
        issues.push({
          file: relativeFile,
          message: `Folder "${folderName}" must match slug "${metadata.slug}".`,
        });
      }

      if (!metadata.draft && !isPublishedArticleComplete(metadata)) {
        issues.push({
          file: relativeFile,
          message:
            "Published articles require description, thumbnail, and at least one category.",
        });
      }

      if (metadata.thumbnail) {
        await assetExists(
          articleDirectory,
          metadata.thumbnail,
          relativeFile,
          issues
        );
      }

      const mdxAssets = document.body.matchAll(
        /\b(?:src|poster)=["'](\.\/images\/[^"']+)["']/g
      );
      for (const match of mdxAssets) {
        if (match[1]) {
          await assetExists(articleDirectory, match[1], relativeFile, issues);
        }
      }

      validateMdxBody(document.body, relativeFile, issues);

      articles.push({
        ...metadata,
        thumbnailUrl: metadata.thumbnail
          ? resolveContentAssetUrl(
              "articles",
              metadata.slug,
              metadata.thumbnail
            )
          : undefined,
      });
    } catch (error) {
      issues.push({
        file: relativeFile,
        message:
          error instanceof Error ? error.message : "Unable to read article.",
      });
    }
  }

  return articles;
}

async function readExperiences(issues: ContentIssue[]) {
  const experiences: Experience[] = [];
  let experienceDirectories: string[] = [];

  try {
    experienceDirectories = await directoryNames(EXPERIENCES_ROOT);
  } catch (error) {
    issues.push({
      file: "content/experiences",
      message:
        error instanceof Error ? error.message : "Unable to read directory.",
    });
    return experiences;
  }

  for (const folderName of experienceDirectories) {
    const experienceDirectory = path.join(EXPERIENCES_ROOT, folderName);
    const filePath = path.join(experienceDirectory, "index.yml");
    const experience = await readYamlFile(filePath, ExperienceSchema, issues);

    if (!experience) {
      continue;
    }

    if (experience.id !== folderName) {
      issues.push({
        file: path.relative(PROJECT_ROOT, filePath),
        message: `Folder "${folderName}" must match id "${experience.id}".`,
      });
    }

    for (const image of experience.images) {
      await assetExists(
        experienceDirectory,
        image,
        path.relative(PROJECT_ROOT, filePath),
        issues
      );
    }

    experiences.push(experience);
  }

  return experiences;
}

function duplicateValues(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates];
}

function validateRelations(snapshot: ContentSnapshot, issues: ContentIssue[]) {
  const articleBySlug = new Map(
    snapshot.articles.map((article) => [article.slug, article])
  );
  const experienceById = new Map(
    snapshot.experiences.map((experience) => [experience.id, experience])
  );

  const categoryOrders = articleCategoryIds.map(
    (category) => snapshot.taxonomy.categories[category].order
  );
  if (new Set(categoryOrders).size !== categoryOrders.length) {
    issues.push({
      file: "content/taxonomy.yml",
      message: "Category order values must be unique.",
    });
  }

  for (const article of snapshot.articles) {
    for (const category of articleCategoryIds) {
      const knownTags = snapshot.taxonomy.categories[category].tags;
      for (const tag of article.categories[category]) {
        if (!knownTags[tag]) {
          issues.push({
            file: `content/articles/${article.slug}/index.mdx`,
            message: `Unknown tag "${tag}" in category "${category}".`,
          });
        }
      }
    }

    for (const duplicate of duplicateValues(article.spotlightIn)) {
      issues.push({
        file: `content/articles/${article.slug}/index.mdx`,
        message: `Spotlight category "${duplicate}" is duplicated.`,
      });
    }

    for (const category of article.spotlightIn) {
      if (article.categories[category].length === 0) {
        issues.push({
          file: `content/articles/${article.slug}/index.mdx`,
          message: `A spotlight article must belong to category "${category}".`,
        });
      }
    }

    for (const duplicate of duplicateValues(article.related)) {
      issues.push({
        file: `content/articles/${article.slug}/index.mdx`,
        message: `Related article "${duplicate}" is duplicated.`,
      });
    }

    for (const relatedSlug of article.related) {
      if (relatedSlug === article.slug) {
        issues.push({
          file: `content/articles/${article.slug}/index.mdx`,
          message: "An article cannot relate to itself.",
        });
      } else if (!articleBySlug.has(relatedSlug)) {
        issues.push({
          file: `content/articles/${article.slug}/index.mdx`,
          message: `Related article "${relatedSlug}" does not exist.`,
        });
      }
    }
  }

  for (const category of articleCategoryIds) {
    const spotlighted = snapshot.articles.filter((article) =>
      article.spotlightIn.includes(category)
    );

    if (spotlighted.length > 1) {
      issues.push({
        file: "content/articles",
        message: `Category "${category}" can spotlight only one article. Found: ${spotlighted
          .map((article) => article.slug)
          .join(", ")}.`,
      });
    }
  }

  for (const experience of snapshot.experiences) {
    const file = `content/experiences/${experience.id}/index.yml`;

    for (const duplicate of duplicateValues(experience.articles)) {
      issues.push({
        file,
        message: `Article "${duplicate}" is duplicated.`,
      });
    }

    for (const slug of experience.articles) {
      const article = articleBySlug.get(slug);
      if (!article) {
        issues.push({
          file,
          message: `Article "${slug}" does not exist.`,
        });
      } else if (article.draft) {
        issues.push({
          file,
          message: `Article "${slug}" is a draft and cannot be featured.`,
        });
      }
    }
  }

  for (const duplicate of duplicateValues(
    snapshot.placements.home.featuredWorks
  )) {
    issues.push({
      file: "content/placements.yml",
      message: `home.featuredWorks contains duplicate "${duplicate}".`,
    });
  }

  for (const id of snapshot.placements.home.featuredWorks) {
    if (!experienceById.has(id)) {
      issues.push({
        file: "content/placements.yml",
        message: `home.featuredWorks references unknown experience "${id}".`,
      });
    }
  }

  const placementSlots: Array<{
    file: string;
    values: string[];
  }> = [
    {
      file: "home.featuredArticles",
      values: snapshot.placements.home.featuredArticles,
    },
  ];

  for (const slot of placementSlots) {
    for (const duplicate of duplicateValues(slot.values)) {
      issues.push({
        file: "content/placements.yml",
        message: `${slot.file} contains duplicate "${duplicate}".`,
      });
    }

    for (const id of slot.values) {
      const article = articleBySlug.get(id);
      if (!article) {
        issues.push({
          file: "content/placements.yml",
          message: `${slot.file} references unknown article "${id}".`,
        });
      } else if (article.draft) {
        issues.push({
          file: "content/placements.yml",
          message: `${slot.file} references draft article "${id}".`,
        });
      }
    }
  }
}

export async function inspectContent() {
  const issues: ContentIssue[] = [];

  const [articles, experiences, about, taxonomy, placements] =
    await Promise.all([
      readArticles(issues),
      readExperiences(issues),
      readYamlFile(path.join(ABOUT_ROOT, "index.yml"), AboutSchema, issues),
      readYamlFile(
        path.join(CONTENT_ROOT, "taxonomy.yml"),
        TaxonomySchema,
        issues
      ),
      readYamlFile(
        path.join(CONTENT_ROOT, "placements.yml"),
        PlacementSchema,
        issues
      ),
    ]);

  if (!about || !taxonomy || !placements) {
    return { issues, snapshot: null };
  }

  if (about.hero.image) {
    await assetExists(
      ABOUT_ROOT,
      about.hero.image,
      "content/about/index.yml",
      issues
    );
  }
  for (const image of about.maker.gallery) {
    await assetExists(ABOUT_ROOT, image, "content/about/index.yml", issues);
  }

  const snapshot: ContentSnapshot = {
    articles,
    experiences,
    about,
    taxonomy,
    placements,
  };

  validateRelations(snapshot, issues);

  return { issues, snapshot };
}

async function getSnapshot() {
  const result = await inspectContent();
  if (!result.snapshot || result.issues.length > 0) {
    throw new ContentValidationError(result.issues);
  }
  return result.snapshot;
}

export async function getArticles(options?: { includeDraft?: boolean }) {
  const snapshot = await getSnapshot();
  const includeDraft =
    options?.includeDraft ?? process.env.NODE_ENV !== "production";

  return snapshot.articles
    .filter((article) => includeDraft || !article.draft)
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(
  slug: string,
  options?: { includeDraft?: boolean }
) {
  const articles = await getArticles(options);
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getExperiences() {
  return (await getSnapshot()).experiences;
}

export async function getAbout() {
  return (await getSnapshot()).about;
}

export async function getTaxonomy() {
  return (await getSnapshot()).taxonomy;
}

export async function getPlacements() {
  return (await getSnapshot()).placements;
}

export async function resolveArticleSlugs(slugs: readonly string[]) {
  const articles = await getArticles({ includeDraft: false });
  const articleBySlug = new Map(
    articles.map((article) => [article.slug, article])
  );

  return slugs.map((slug) => {
    const article = articleBySlug.get(slug);
    if (!article) {
      throw new Error(`Unable to resolve published article "${slug}".`);
    }
    return article;
  });
}

export async function resolveExperienceIds(ids: readonly string[]) {
  const experiences = await getExperiences();
  const experienceById = new Map(
    experiences.map((experience) => [experience.id, experience])
  );

  return ids.map((id) => {
    const experience = experienceById.get(id);
    if (!experience) {
      throw new Error(`Unable to resolve experience "${id}".`);
    }
    return experience;
  });
}

export function orderArticlesForCategory(
  articles: readonly ArticleSummary[],
  category: ArticleCategoryId
) {
  return articles
    .filter((article) => article.categories[category].length > 0)
    .toSorted((a, b) => {
      const aSpotlight = a.spotlightIn.includes(category);
      const bSpotlight = b.spotlightIn.includes(category);

      if (aSpotlight !== bSpotlight) {
        return aSpotlight ? -1 : 1;
      }

      return b.date.localeCompare(a.date);
    });
}

export { CONTENT_ROOT, PROJECT_ROOT };
