import {
  ContentValidationError,
  inspectContent,
} from "../src/lib/content";

const result = await inspectContent();

if (!result.snapshot || result.issues.length > 0) {
  throw new ContentValidationError(result.issues);
}

console.log(
  `Content is valid: ${result.snapshot.articles.length} articles, ${result.snapshot.experiences.length} experiences.`,
);
