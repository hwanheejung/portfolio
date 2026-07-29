import { createHash } from "node:crypto";
import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";
import YAML from "yaml";

const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const CONTENT_ROOT = path.join(PROJECT_ROOT, "content");
const ARTICLES_ROOT = path.join(CONTENT_ROOT, "articles");
const EXPERIENCES_ROOT = path.join(CONTENT_ROOT, "experiences");
const GENERATED_ROOT = path.join(
  PROJECT_ROOT,
  "src",
  "__generated__",
  "content"
);
const PUBLIC_CONTENT_ROOT = path.join(PROJECT_ROOT, "public", "_content");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
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

export class ContentCompilationError extends Error {
  constructor(issues) {
    super(
      [
        "Content compilation failed:",
        ...issues.map((issue) => `- ${issue.file}: ${issue.message}`),
      ].join("\n")
    );
    this.name = "ContentCompilationError";
    this.issues = issues;
  }
}

async function readJson(relativePath) {
  const filePath = path.join(PROJECT_ROOT, relativePath);
  const source = await readFile(filePath, "utf8");
  return {
    data: JSON.parse(source),
    filePath,
    relativePath,
    source,
  };
}

function parseMdxDocument(source, file) {
  const match = FRONTMATTER_PATTERN.exec(source);
  if (!match) {
    throw new ContentCompilationError([
      { file, message: "MDX files must begin with YAML frontmatter." },
    ]);
  }

  return {
    data: YAML.parse(match[1] ?? ""),
    body: match[2] ?? "",
  };
}

function formatAjvErrors(errors) {
  return (errors ?? [])
    .map((error) => {
      const location = error.dataPath || "root";
      return `${location}: ${error.message}`;
    })
    .join("; ");
}

function createValidator(schema) {
  const ajv = new Ajv({
    allErrors: true,
    jsonPointers: true,
    schemaId: "auto",
  });
  return ajv.compile(schema);
}

function stripSchemaKey(value) {
  const content = { ...value };
  delete content.$schema;
  return content;
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function resolveAssetPath(directory, assetPath) {
  if (!assetPath?.startsWith("./images/")) return null;
  const resolved = path.resolve(directory, assetPath);
  const imagesDirectory = path.resolve(directory, "images");
  if (
    resolved !== imagesDirectory &&
    !resolved.startsWith(`${imagesDirectory}${path.sep}`)
  ) {
    return null;
  }
  return resolved;
}

function resolveAssetUrl(collection, id, assetPath) {
  const relativePath = assetPath.slice(2);
  return ["/_content", collection, id, relativePath].filter(Boolean).join("/");
}

function validateMdxBody(body, file, issues) {
  const proseOnly = body
    .replace(/(?:\x60\x60\x60|~~~)[\s\S]*?(?:\x60\x60\x60|~~~)/g, "")
    .replace(/`[^`\n]*`/g, "");

  if (/^\s*(?:import|export)\s/m.test(proseOnly)) {
    issues.push({
      file,
      message: "MDX imports and exports are not allowed in article content.",
    });
  }

  for (const match of proseOnly.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
    const component = match[1];
    if (component && !ALLOWED_MDX_COMPONENTS.has(component)) {
      issues.push({
        file,
        message: `Unknown MDX component <${component}>.`,
      });
    }
  }
}

function createHeadingId(title) {
  return title
    .toLocaleLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractArticleToc(body) {
  const proseOnly = body
    .replace(
      /^(?: {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?: {0,3})\1[ \t]*$/gm,
      ""
    )
    .replace(/`[^`\n]+`/g, "");
  const matches = proseOnly.matchAll(
    /^(#{1,3})\s+(.+?)\s*$|<SectionHeading\s+[^>]*title=(?:"([^"]+)"|'([^']+)')[^>]*\/>/gm
  );
  const headings = [];

  for (const match of matches) {
    const markdownLevel = match[1]?.length;
    const title = (match[2] ?? match[3] ?? match[4] ?? "")
      .replace(/\s+#+$/, "")
      .trim();
    if (!title) continue;
    headings.push({
      id: createHeadingId(title),
      level: markdownLevel ? Math.min(markdownLevel, 3) : 2,
      title,
    });
  }

  return headings;
}

function plainTextFromMdx(body) {
  return body
    .replace(
      /^(?: {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?: {0,3})\1[ \t]*$/gm,
      ""
    )
    .replace(/<Figure[\s\S]*?\/>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`>]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildSearchDocuments(
  articlesBySlug,
  articleSlugs,
  worksBySlug,
  workSlugs,
  experiences,
  about
) {
  const documents = articleSlugs.map((slug) => {
    const article = articlesBySlug[slug];
    return {
      id: `article:${slug}`,
      sourceType: "article",
      sourceId: slug,
      title: article.title,
      kind: article.kind,
      topics: article.topics,
      experienceIds: [],
      url: `/articles/${slug}`,
      text: article.searchText,
    };
  });

  for (const slug of workSlugs) {
    const work = worksBySlug[slug];
    documents.push({
      id: `work:${slug}`,
      sourceType: "work",
      sourceId: slug,
      title: work.title,
      kind: work.kind,
      topics: work.topics,
      experienceIds: [work.experienceId],
      url: `/${slug}`,
      text: work.searchText,
    });
  }

  for (const experience of experiences) {
    documents.push({
      id: `experience:${experience.id}`,
      sourceType: "experience",
      sourceId: experience.id,
      title: `${experience.organization} — ${experience.role}`,
      kind: null,
      topics: [],
      experienceIds: [experience.id],
      url: "/about",
      text: [experience.summary, ...experience.highlights].join("\n"),
    });
  }

  documents.push({
    id: "about:profile",
    sourceType: "about",
    sourceId: "profile",
    title: about.hero.heading,
    kind: null,
    topics: [],
    experienceIds: [],
    url: "/about",
    text: [
      about.hero.description,
      ...about.summary.body,
      ...about.history.body,
      ...about.leadership.body,
      ...about.problemSolving.body,
    ].join("\n"),
  });

  return documents;
}

function generatedTypesSource() {
  return `// Generated by \`pnpm content:compile\`. Do not edit.

export type TaxonomyEntry = {
  readonly label: string;
  readonly color: string;
};

export type ArticleKind = TaxonomyEntry & {
  readonly singularLabel: string;
  readonly description: string;
  readonly order: number;
};

export type ArticleTocItem = {
  readonly id: string;
  readonly level: 1 | 2 | 3;
  readonly title: string;
};

export type ArticleSummary = {
  readonly title: string;
  readonly slug: string;
  readonly date: string;
  readonly draft: boolean;
  readonly description?: string;
  readonly thumbnail?: string;
  readonly thumbnailUrl?: string;
  readonly kind: string;
  readonly topics: readonly string[];
  readonly spotlightIn: Readonly<Record<string, number>>;
  readonly related: readonly string[];
  readonly toc: readonly ArticleTocItem[];
};

export type WorkSummary = {
  readonly title: string;
  readonly slug: string;
  readonly date: string;
  readonly draft: boolean;
  readonly description?: string;
  readonly thumbnail?: string;
  readonly thumbnailUrl?: string;
  readonly kind: string;
  readonly topics: readonly string[];
  readonly experienceId: string;
  readonly spotlightIn: Readonly<Record<string, number>>;
  readonly toc: readonly ArticleTocItem[];
};

export type Experience = {
  readonly id: string;
  readonly organization: string;
  readonly role: string;
  readonly period: {
    readonly start: string;
    readonly end: string | null;
  };
  readonly summary: string;
  readonly scale: string;
  readonly learning: string;
  readonly highlights: readonly string[];
  readonly images: readonly string[];
  readonly workSlugs: readonly string[];
};

export type ContentManifest = {
  readonly buildId: string;
  readonly taxonomy: {
    readonly kinds: Readonly<Record<string, ArticleKind>>;
    readonly topics: Readonly<Record<string, TaxonomyEntry>>;
  };
  readonly about: About;
  readonly experienceIds: readonly string[];
  readonly experiencesById: Readonly<Record<string, Experience>>;
  readonly articleSlugs: readonly string[];
  readonly articlesBySlug: Readonly<Record<string, ArticleSummary>>;
  readonly workSlugs: readonly string[];
  readonly worksBySlug: Readonly<Record<string, WorkSummary>>;
  readonly home: {
    readonly featuredArticles: readonly string[];
    readonly featuredWorks: readonly string[];
  };
};

export type Narrative = {
  readonly heading: string;
  readonly body: readonly string[];
};

export type About = {
  readonly hero: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly description: string;
    readonly image?: string;
  };
  readonly summary: Narrative;
  readonly principles: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
  }[];
  readonly history: Narrative;
  readonly leadership: Narrative;
  readonly problemSolving: Narrative;
  readonly maker: {
    readonly heading: string;
    readonly description: string;
    readonly gallery: readonly string[];
  };
};

export type Taxonomy = ContentManifest["taxonomy"];
`;
}

function generatedManifestSource(manifest) {
  return `// Generated by \`pnpm content:compile\`. Do not edit.
import type { ContentManifest } from "./types.generated";

export const content = ${JSON.stringify(
    manifest,
    null,
    2
  )} as const satisfies ContentManifest;

export type ArticleKindId = keyof typeof content.taxonomy.kinds;
export type TopicId = keyof typeof content.taxonomy.topics;
export type ExperienceId = keyof typeof content.experiencesById;
export type ArticleSlug = keyof typeof content.articlesBySlug;
export type WorkSlug = keyof typeof content.worksBySlug;
`;
}

function generatedIndexSource() {
  return `// Generated by \`pnpm content:compile\`. Do not edit.
export { content } from "./manifest.generated";
export type {
  ArticleKindId,
  ArticleSlug,
  ExperienceId,
  TopicId,
  WorkSlug,
} from "./manifest.generated";
export type {
  About,
  ArticleKind,
  ArticleSummary,
  ArticleTocItem,
  ContentManifest,
  Experience,
  Taxonomy,
  TaxonomyEntry,
  WorkSummary,
} from "./types.generated";
`;
}

async function writeGeneratedArtifacts(files) {
  const parent = path.dirname(GENERATED_ROOT);
  const temporaryRoot = path.join(
    parent,
    `.content-${process.pid}-${Date.now()}`
  );
  await mkdir(temporaryRoot, { recursive: true });
  await Promise.all(
    Object.entries(files).map(([name, source]) =>
      writeFile(path.join(temporaryRoot, name), source, "utf8")
    )
  );
  await rm(GENERATED_ROOT, { recursive: true, force: true });
  await rename(temporaryRoot, GENERATED_ROOT);
}

async function assertGeneratedArtifactsCurrent(files, issues) {
  for (const [name, expected] of Object.entries(files)) {
    const file = path.join(GENERATED_ROOT, name);
    try {
      const actual = await readFile(file, "utf8");
      if (actual !== expected) {
        issues.push({
          file: path.relative(PROJECT_ROOT, file),
          message: "Generated artifact is stale. Run pnpm content:compile.",
        });
      }
    } catch {
      issues.push({
        file: path.relative(PROJECT_ROOT, file),
        message: "Generated artifact is missing. Run pnpm content:compile.",
      });
    }
  }
}

async function copyContentAssets() {
  await rm(PUBLIC_CONTENT_ROOT, { recursive: true, force: true });
  await mkdir(PUBLIC_CONTENT_ROOT, { recursive: true });

  const articleEntries = await readdir(ARTICLES_ROOT, { withFileTypes: true });
  for (const entry of articleEntries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const source = path.join(ARTICLES_ROOT, entry.name, "images");
    if (await fileExists(source)) {
      await cp(
        source,
        path.join(PUBLIC_CONTENT_ROOT, "articles", entry.name, "images"),
        { recursive: true, force: true }
      );
    }
  }

  const experienceEntries = await readdir(EXPERIENCES_ROOT, {
    withFileTypes: true,
  });
  for (const experienceEntry of experienceEntries) {
    if (
      !experienceEntry.isDirectory() ||
      experienceEntry.name.startsWith(".")
    ) {
      continue;
    }
    const workRoot = path.join(EXPERIENCES_ROOT, experienceEntry.name);
    if (!(await fileExists(path.join(workRoot, "index.mdx")))) continue;
    const source = path.join(workRoot, "images");
    if (await fileExists(source)) {
      await cp(
        source,
        path.join(
          PUBLIC_CONTENT_ROOT,
          "works",
          experienceEntry.name,
          "images"
        ),
        { recursive: true, force: true }
      );
    }
  }

  for (const collection of ["experiences", "about"]) {
    const source = path.join(CONTENT_ROOT, collection, "images");
    if (await fileExists(source)) {
      await cp(source, path.join(PUBLIC_CONTENT_ROOT, collection, "images"), {
        recursive: true,
        force: true,
      });
    }
  }
}

export async function compileContent({
  check = false,
  validateOnly = false,
} = {}) {
  const issues = [];
  const sourceHasher = createHash("sha256");

  const [
    taxonomyFile,
    taxonomySchemaFile,
    experiencesFile,
    experienceSchemaFile,
    aboutFile,
    aboutSchemaFile,
    articleSchemaFile,
    workSchemaFile,
  ] = await Promise.all([
    readJson("content/taxonomy.json"),
    readJson("content/taxonomy.schema.json"),
    readJson("content/experiences/index.json"),
    readJson("content/experiences/experience.schema.json"),
    readJson("content/about/index.json"),
    readJson("content/about/about.schema.json"),
    readJson("content/articles/article.schema.json"),
    readJson("content/experiences/work.schema.json"),
  ]);

  for (const file of [
    taxonomyFile,
    taxonomySchemaFile,
    experiencesFile,
    experienceSchemaFile,
    aboutFile,
    aboutSchemaFile,
    articleSchemaFile,
    workSchemaFile,
  ]) {
    sourceHasher.update(file.relativePath);
    sourceHasher.update(file.source);
  }

  const validationTargets = [
    [taxonomyFile, taxonomySchemaFile],
    [experiencesFile, experienceSchemaFile],
    [aboutFile, aboutSchemaFile],
  ];
  for (const [sourceFile, schemaFile] of validationTargets) {
    const validate = createValidator(schemaFile.data);
    if (!validate(sourceFile.data)) {
      issues.push({
        file: sourceFile.relativePath,
        message: formatAjvErrors(validate.errors),
      });
    }
  }

  const taxonomy = stripSchemaKey(taxonomyFile.data);
  const experiencesSource = stripSchemaKey(experiencesFile.data);
  const about = stripSchemaKey(aboutFile.data);
  const experiences = experiencesSource.experiences ?? [];
  const experienceIds = experiences.map((experience) => experience.id);
  const experienceIdSet = new Set(experienceIds);

  for (const duplicate of duplicateValues(experienceIds)) {
    issues.push({
      file: experiencesFile.relativePath,
      message: `Experience id "${duplicate}" is duplicated.`,
    });
  }

  for (const experience of experiences) {
    for (const image of experience.images ?? []) {
      const imagePath = resolveAssetPath(
        path.join(CONTENT_ROOT, "experiences"),
        image
      );
      if (!imagePath || !(await fileExists(imagePath))) {
        issues.push({
          file: experiencesFile.relativePath,
          message: `Experience image "${image}" does not exist.`,
        });
      }
    }
  }

  for (const image of [
    about.hero?.image,
    ...(about.maker?.gallery ?? []),
  ].filter(Boolean)) {
    const imagePath = resolveAssetPath(path.join(CONTENT_ROOT, "about"), image);
    if (!imagePath || !(await fileExists(imagePath))) {
      issues.push({
        file: aboutFile.relativePath,
        message: `About image "${image}" does not exist.`,
      });
    }
  }

  const kindOrders = Object.values(taxonomy.kinds ?? {}).map(
    (kind) => kind.order
  );
  for (const duplicate of duplicateValues(kindOrders)) {
    issues.push({
      file: taxonomyFile.relativePath,
      message: `Kind order "${duplicate}" is duplicated.`,
    });
  }

  const articleEntries = (
    await readdir(ARTICLES_ROOT, {
      withFileTypes: true,
    })
  )
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));
  const validateArticle = createValidator(articleSchemaFile.data);
  const articlesBySlug = {};
  const articleBodies = {};

  for (const entry of articleEntries) {
    const relativeFile = `content/articles/${entry.name}/index.mdx`;
    const articleFile = path.join(ARTICLES_ROOT, entry.name, "index.mdx");
    let source;
    try {
      source = await readFile(articleFile, "utf8");
    } catch {
      issues.push({ file: relativeFile, message: "Article file is missing." });
      continue;
    }
    sourceHasher.update(relativeFile);
    sourceHasher.update(source);

    let document;
    try {
      document = parseMdxDocument(source, relativeFile);
    } catch (error) {
      if (error instanceof ContentCompilationError) {
        issues.push(...error.issues);
        continue;
      }
      throw error;
    }

    if (!validateArticle(document.data)) {
      issues.push({
        file: relativeFile,
        message: formatAjvErrors(validateArticle.errors),
      });
      continue;
    }

    const article = document.data;
    if (article.slug !== entry.name) {
      issues.push({
        file: relativeFile,
        message: `Folder "${entry.name}" must match slug "${article.slug}".`,
      });
    }
    if (!SLUG_PATTERN.test(article.slug)) {
      issues.push({ file: relativeFile, message: "Article slug is invalid." });
    }
    if (Number.isNaN(Date.parse(`${article.date}T00:00:00Z`))) {
      issues.push({ file: relativeFile, message: "Article date is invalid." });
    }
    if (!taxonomy.kinds?.[article.kind]) {
      issues.push({
        file: relativeFile,
        message: `Unknown article kind "${article.kind}".`,
      });
    }
    for (const topic of article.topics) {
      if (!taxonomy.topics?.[topic]) {
        issues.push({
          file: relativeFile,
          message: `Unknown topic "${topic}".`,
        });
      }
    }
    if (!article.draft && (!article.description || !article.thumbnail)) {
      issues.push({
        file: relativeFile,
        message: "Published articles require description and thumbnail.",
      });
    }
    if (article.thumbnail) {
      const thumbnailPath = resolveAssetPath(
        path.dirname(articleFile),
        article.thumbnail
      );
      if (!thumbnailPath || !(await fileExists(thumbnailPath))) {
        issues.push({
          file: relativeFile,
          message: `Thumbnail "${article.thumbnail}" does not exist.`,
        });
      }
    }
    validateMdxBody(document.body, relativeFile, issues);

    articlesBySlug[article.slug] = {
      ...article,
      ...(article.thumbnail
        ? {
            thumbnailUrl: resolveAssetUrl(
              "articles",
              article.slug,
              article.thumbnail
            ),
          }
        : {}),
      toc: extractArticleToc(document.body),
      searchText: plainTextFromMdx(document.body),
    };
    articleBodies[article.slug] = document.body;
  }

  const articleSlugs = Object.keys(articlesBySlug).sort((a, b) =>
    articlesBySlug[b].date.localeCompare(articlesBySlug[a].date)
  );
  const validateWork = createValidator(workSchemaFile.data);
  const worksBySlug = {};
  const workBodies = {};

  const workEntries = (await readdir(EXPERIENCES_ROOT, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of workEntries) {
      const relativeFile = `content/experiences/${entry.name}/index.mdx`;
      const workFile = path.join(EXPERIENCES_ROOT, entry.name, "index.mdx");
      if (!(await fileExists(workFile))) continue;
      let source;
      try {
        source = await readFile(workFile, "utf8");
      } catch {
        issues.push({ file: relativeFile, message: "Work file is missing." });
        continue;
      }
      sourceHasher.update(relativeFile);
      sourceHasher.update(source);

      let document;
      try {
        document = parseMdxDocument(source, relativeFile);
      } catch (error) {
        if (error instanceof ContentCompilationError) {
          issues.push(...error.issues);
          continue;
        }
        throw error;
      }

      if (!validateWork(document.data)) {
        issues.push({
          file: relativeFile,
          message: formatAjvErrors(validateWork.errors),
        });
        continue;
      }

      const work = document.data;
      if (work.slug !== entry.name) {
        issues.push({
          file: relativeFile,
          message: `Folder "${entry.name}" must match slug "${work.slug}".`,
        });
      }
      if (worksBySlug[work.slug] || articlesBySlug[work.slug]) {
        issues.push({
          file: relativeFile,
          message: `Content slug "${work.slug}" must be globally unique.`,
        });
      }
      if (!experienceIdSet.has(work.experienceId)) {
        issues.push({
          file: relativeFile,
          message: `Unknown experience "${work.experienceId}".`,
        });
      }
      if (!taxonomy.kinds?.[work.kind]) {
        issues.push({
          file: relativeFile,
          message: `Unknown work kind "${work.kind}".`,
        });
      }
      for (const topic of work.topics) {
        if (!taxonomy.topics?.[topic]) {
          issues.push({
            file: relativeFile,
            message: `Unknown topic "${topic}".`,
          });
        }
      }
      if (!work.draft && (!work.description || !work.thumbnail)) {
        issues.push({
          file: relativeFile,
          message: "Published works require description and thumbnail.",
        });
      }
      if (work.thumbnail) {
        const thumbnailPath = resolveAssetPath(
          path.dirname(workFile),
          work.thumbnail
        );
        if (!thumbnailPath || !(await fileExists(thumbnailPath))) {
          issues.push({
            file: relativeFile,
            message: `Thumbnail "${work.thumbnail}" does not exist.`,
          });
        }
      }
      validateMdxBody(document.body, relativeFile, issues);

      worksBySlug[work.slug] = {
        ...work,
        ...(work.thumbnail
          ? {
              thumbnailUrl: resolveAssetUrl("works", work.slug, work.thumbnail),
            }
          : {}),
        toc: extractArticleToc(document.body),
        searchText: plainTextFromMdx(document.body),
      };
      workBodies[work.slug] = document.body;
  }

  const workSlugs = Object.keys(worksBySlug).sort((a, b) =>
    worksBySlug[b].date.localeCompare(worksBySlug[a].date)
  );
  const articleHomeOrders = new Map();
  const workHomeOrders = new Map();

  for (const slug of articleSlugs) {
    const article = articlesBySlug[slug];
    for (const relatedSlug of article.related) {
      if (relatedSlug === slug) {
        issues.push({
          file: `content/articles/${slug}/index.mdx`,
          message: "An article cannot relate to itself.",
        });
      } else if (!articlesBySlug[relatedSlug]) {
        issues.push({
          file: `content/articles/${slug}/index.mdx`,
          message: `Related article "${relatedSlug}" does not exist.`,
        });
      }
    }

    const homeOrder = article.spotlightIn.home;
    if (homeOrder !== undefined) {
      if (article.draft) {
        issues.push({
          file: `content/articles/${slug}/index.mdx`,
          message: "Draft articles cannot be spotlighted on home.",
        });
      }
      const existing = articleHomeOrders.get(homeOrder);
      if (existing) {
        issues.push({
          file: `content/articles/${slug}/index.mdx`,
          message: `Home spotlight order ${homeOrder} is already used by "${existing}".`,
        });
      }
      articleHomeOrders.set(homeOrder, slug);
    }
  }

  for (const slug of workSlugs) {
    const work = worksBySlug[slug];
    const homeOrder = work.spotlightIn.home;
    if (homeOrder === undefined) continue;
    if (work.draft) {
      issues.push({
        file: `content/experiences/${slug}/index.mdx`,
        message: "Draft works cannot be spotlighted on home.",
      });
    }
    const existing = workHomeOrders.get(homeOrder);
    if (existing) {
      issues.push({
        file: `content/experiences/${slug}/index.mdx`,
        message: `Home work order ${homeOrder} is already used by "${existing}".`,
      });
    }
    workHomeOrders.set(homeOrder, slug);
  }

  const featuredArticles = articleSlugs
    .filter((slug) => articlesBySlug[slug].spotlightIn.home !== undefined)
    .sort(
      (a, b) =>
        articlesBySlug[a].spotlightIn.home -
          articlesBySlug[b].spotlightIn.home ||
        articlesBySlug[b].date.localeCompare(articlesBySlug[a].date)
    );
  const featuredWorks = workSlugs
    .filter((slug) => worksBySlug[slug].spotlightIn.home !== undefined)
    .sort(
      (a, b) =>
        worksBySlug[a].spotlightIn.home - worksBySlug[b].spotlightIn.home ||
        worksBySlug[b].date.localeCompare(worksBySlug[a].date)
    );

  const compiledExperiences = experiences.map((experience) => ({
    ...experience,
    workSlugs: workSlugs.filter(
      (slug) => worksBySlug[slug].experienceId === experience.id
    ),
  }));
  const experiencesById = Object.fromEntries(
    compiledExperiences.map((experience) => [experience.id, experience])
  );

  if (issues.length > 0) {
    throw new ContentCompilationError(issues);
  }

  for (const article of Object.values(articlesBySlug)) {
    delete article.searchText;
  }
  for (const work of Object.values(worksBySlug)) {
    delete work.searchText;
  }

  const manifest = {
    buildId: sourceHasher.digest("hex").slice(0, 16),
    taxonomy,
    about,
    experienceIds,
    experiencesById,
    articleSlugs,
    articlesBySlug,
    workSlugs,
    worksBySlug,
    home: { featuredArticles, featuredWorks },
  };
  const searchDocuments = buildSearchDocuments(
    Object.fromEntries(
      articleSlugs.map((slug) => [
        slug,
        {
          ...articlesBySlug[slug],
          searchText: plainTextFromMdx(articleBodies[slug]),
        },
      ])
    ),
    articleSlugs,
    Object.fromEntries(
      workSlugs.map((slug) => [
        slug,
        {
          ...worksBySlug[slug],
          searchText: plainTextFromMdx(workBodies[slug]),
        },
      ])
    ),
    workSlugs,
    compiledExperiences,
    about
  );
  const generatedFiles = {
    "index.ts": generatedIndexSource(),
    "manifest.generated.ts": generatedManifestSource(manifest),
    "search-documents.generated.json": `${JSON.stringify(
      searchDocuments,
      null,
      2
    )}\n`,
    "types.generated.ts": generatedTypesSource(),
  };

  if (validateOnly) {
    // Source validation and relation checks above are the complete check.
  } else if (check) {
    await assertGeneratedArtifactsCurrent(generatedFiles, issues);
    if (issues.length > 0) throw new ContentCompilationError(issues);
  } else {
    await writeGeneratedArtifacts(generatedFiles);
    await copyContentAssets();
  }

  return {
    articleCount: articleSlugs.length,
    workCount: workSlugs.length,
    experienceCount: experienceIds.length,
    featuredCount: featuredArticles.length + featuredWorks.length,
    manifest,
  };
}

export { CONTENT_ROOT, PROJECT_ROOT };
