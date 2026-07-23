import { SlugSchema } from "../schema/article";
import {
  ContentValidationError,
  inspectContent,
} from "../src/lib/content";

const slug = SlugSchema.parse(process.argv[2]);
const result = await inspectContent();
const articlePrefix = `content/articles/${slug}/`;
const relevantIssues = result.issues.filter(
  (issue) =>
    issue.file.startsWith(articlePrefix) ||
    (issue.file === "content/placements.yml" &&
      issue.message.includes(`"${slug}"`)),
);

if (!result.snapshot?.articles.some((article) => article.slug === slug)) {
  relevantIssues.push({
    file: `content/articles/${slug}`,
    message: "Article does not exist or its metadata is invalid.",
  });
}

if (relevantIssues.length > 0) {
  throw new ContentValidationError(relevantIssues);
}

console.log(`Article "${slug}" is valid.`);
