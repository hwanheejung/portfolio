import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import {
  type ArticleMetadata,
  ArticleMetadataSchema,
  SlugSchema,
} from "../schema/article";
import { getTaxonomy, PROJECT_ROOT } from "../src/lib/content";
import {
  ask,
  chooseCategories,
  titleFromSlug,
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

const taxonomy = await getTaxonomy();
const title = await ask("Title", titleFromSlug(slug));
const categories = await chooseCategories(taxonomy);

try {
  await mkdir(articleDirectory);
} catch (error) {
  if (error instanceof Error && "code" in error && error.code === "EEXIST") {
    throw new Error(`Article "${slug}" already exists.`);
  }
  throw error;
}

const metadata: ArticleMetadata = ArticleMetadataSchema.parse({
  title,
  slug,
  date: today(),
  draft: true,
  categories,
  related: [],
});

const frontmatter = YAML.stringify(metadata, { lineWidth: 0 }).trimEnd();
const source = `---\n${frontmatter}\n---\n\nWrite the article here.\n`;

await Promise.all([
  writeFile(articleFile, source, "utf8"),
  mkdir(path.join(articleDirectory, "images")),
]);

console.log(`Created content/articles/${slug}/index.mdx`);
