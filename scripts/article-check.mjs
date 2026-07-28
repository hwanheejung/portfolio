import path from "node:path";

import {
  compileContent,
  CONTENT_ROOT,
  ContentCompilationError,
} from "./content-compiler.mjs";
import { assertSlug, assertPathExists } from "./article-utils.mjs";

const slug = assertSlug(process.argv[2]);
await assertPathExists(
  path.join(CONTENT_ROOT, "articles", slug, "index.mdx"),
  `Article "${slug}" does not exist.`,
);

try {
  await compileContent({ validateOnly: true });
  console.log(`Article "${slug}" is valid.`);
} catch (error) {
  if (error instanceof ContentCompilationError) {
    const relevant = error.issues.filter(
      (issue) =>
        issue.file.startsWith(`content/articles/${slug}/`) ||
        issue.message.includes(`"${slug}"`),
    );
    if (relevant.length > 0) throw new ContentCompilationError(relevant);
  }
  throw error;
}
