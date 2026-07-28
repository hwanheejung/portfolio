import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  compileContent,
  CONTENT_ROOT,
  ContentCompilationError,
} from "./content-compiler.mjs";
import {
  ask,
  assertPathExists,
  assertSlug,
  chooseArticleClassification,
  readArticleDocument,
  serializeArticle,
} from "./article-utils.mjs";

const slug = assertSlug(process.argv[2]);
const articleDirectory = path.join(CONTENT_ROOT, "articles", slug);
const articleFile = path.join(articleDirectory, "index.mdx");
const document = await readArticleDocument(articleFile);
const taxonomy = JSON.parse(
  await readFile(path.join(CONTENT_ROOT, "taxonomy.json"), "utf8"),
);
const description =
  document.data.description ??
  (await ask("Description used in article cards and metadata"));
const thumbnail =
  document.data.thumbnail ??
  (await ask("Thumbnail path", "./images/thumbnail.webp"));
const classification = await chooseArticleClassification(
  taxonomy,
  document.data,
);
const thumbnailPath = path.resolve(articleDirectory, thumbnail);

if (
  !thumbnail.startsWith("./images/") ||
  !thumbnailPath.startsWith(`${path.join(articleDirectory, "images")}${path.sep}`)
) {
  throw new Error("Thumbnail must be inside ./images/.");
}
await assertPathExists(
  thumbnailPath,
  `Thumbnail "${thumbnail}" does not exist.`,
);

const metadata = {
  ...document.data,
  ...classification,
  description,
  thumbnail,
  draft: false,
};
await writeFile(
  articleFile,
  serializeArticle(metadata, document.body),
  "utf8",
);

try {
  await compileContent();
} catch (error) {
  await writeFile(articleFile, document.source, "utf8");
  if (error instanceof ContentCompilationError) {
    throw error;
  }
  throw error;
}

console.log(`Published "${metadata.title}".`);
