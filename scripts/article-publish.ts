import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  articleCategoryIds,
  ArticleMetadataSchema,
  SlugSchema,
} from "../schema/article";
import {
  getArticles,
  getTaxonomy,
  inspectContent,
  ContentValidationError,
  PROJECT_ROOT,
} from "../src/lib/content";
import { resolveContentAssetPath } from "../src/lib/content/assets";
import { serializeMdxDocument } from "../src/lib/content/frontmatter";
import {
  ask,
  assertPathExists,
  chooseCategories,
  readArticleDocument,
  today,
} from "./article-utils";

const slug = SlugSchema.parse(process.argv[2]);
const articleDirectory = path.join(
  PROJECT_ROOT,
  "content",
  "articles",
  slug,
);
const articleFile = path.join(articleDirectory, "index.mdx");
const originalSource = await readFile(articleFile, "utf8");
const document = await readArticleDocument(articleFile);
const current = ArticleMetadataSchema.parse(document.data);
const taxonomy = await getTaxonomy();

const excerpt =
  current.excerpt ?? (await ask("Excerpt used in article cards and metadata"));
const thumbnail =
  current.thumbnail ??
  (await ask("Thumbnail path", "./images/thumbnail.webp"));

let categories = current.categories;
const hasCategory = articleCategoryIds.some(
  (category) => categories[category].length > 0,
);
if (!hasCategory) {
  categories = await chooseCategories(taxonomy);
}

for (const category of articleCategoryIds) {
  for (const tag of categories[category]) {
    if (!taxonomy.categories[category].tags[tag]) {
      throw new Error(`Unknown ${category} tag "${tag}".`);
    }
  }
}

if (!articleCategoryIds.some((category) => categories[category].length > 0)) {
  throw new Error("Published articles require at least one category and tag.");
}

const thumbnailPath = resolveContentAssetPath(articleDirectory, thumbnail);
if (!thumbnailPath) {
  throw new Error("Thumbnail must be inside ./images/.");
}
await assertPathExists(
  thumbnailPath,
  `Thumbnail "${thumbnail}" does not exist.`,
);

const knownArticles = await getArticles({ includeDraft: true });
const knownSlugs = new Set(knownArticles.map((article) => article.slug));
for (const relatedSlug of current.related) {
  if (!knownSlugs.has(relatedSlug)) {
    throw new Error(`Related article "${relatedSlug}" does not exist.`);
  }
}

const metadata = ArticleMetadataSchema.parse({
  ...current,
  date: current.date || today(),
  excerpt,
  thumbnail,
  categories,
  draft: false,
});

await writeFile(
  articleFile,
  serializeMdxDocument(metadata, document.body),
  "utf8",
);

const validation = await inspectContent();
if (!validation.snapshot || validation.issues.length > 0) {
  await writeFile(articleFile, originalSource, "utf8");
  throw new ContentValidationError(validation.issues);
}

console.log(`Published "${metadata.title}".`);
