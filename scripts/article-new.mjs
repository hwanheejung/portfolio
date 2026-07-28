import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";

import { CONTENT_ROOT } from "./content-compiler.mjs";
import {
  ask,
  assertSlug,
  chooseArticleClassification,
  titleFromSlug,
  today,
} from "./article-utils.mjs";

const slug = assertSlug(process.argv[2]);
const articleDirectory = path.join(CONTENT_ROOT, "articles", slug);
const articleFile = path.join(articleDirectory, "index.mdx");
const taxonomy = JSON.parse(
  await readFile(path.join(CONTENT_ROOT, "taxonomy.json"), "utf8"),
);
const title = await ask("Title", titleFromSlug(slug));
const { kind, topics } = await chooseArticleClassification(taxonomy);

try {
  await mkdir(articleDirectory);
} catch (error) {
  if (error instanceof Error && error.code === "EEXIST") {
    throw new Error(`Article "${slug}" already exists.`);
  }
  throw error;
}

const metadata = {
  title,
  slug,
  date: today(),
  draft: true,
  kind,
  topics,
  experienceIds: [],
  spotlightIn: {},
  related: [],
};
const source = `---\n${YAML.stringify(metadata, {
  lineWidth: 0,
}).trimEnd()}\n---\n\nWrite the article here.\n`;

await Promise.all([
  writeFile(articleFile, source, "utf8"),
  mkdir(path.join(articleDirectory, "images")),
]);

console.log(`Created content/articles/${slug}/index.mdx`);
