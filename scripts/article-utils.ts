import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";

import type { ArticleCategoryId, ArticleMetadata } from "../schema/article";
import { articleCategoryIds } from "../schema/article";
import type { Taxonomy } from "../schema/taxonomy";
import { parseMdxDocument } from "../src/lib/content/frontmatter";

export const today = () => new Date().toISOString().slice(0, 10);

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function parseCommaSeparated(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

export async function ask(question: string, fallback?: string) {
  if (!process.stdin.isTTY) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Interactive input required: ${question}`);
  }

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const suffix = fallback ? ` (${fallback})` : "";
    const answer = (await readline.question(`${question}${suffix}: `)).trim();
    return answer || fallback || "";
  } finally {
    readline.close();
  }
}

export async function chooseCategories(taxonomy: Taxonomy) {
  const availableCategories = articleCategoryIds
    .map(
      (category) =>
        `${category} (${taxonomy.categories[category].label})`,
    )
    .join(", ");

  const categoryAnswer = await ask(
    `Categories, comma separated [${availableCategories}]`,
    "",
  );
  const selectedCategories = parseCommaSeparated(categoryAnswer).filter(
    (category): category is ArticleCategoryId =>
      articleCategoryIds.includes(category as ArticleCategoryId),
  );

  const categories: ArticleMetadata["categories"] = {
    automation: [],
    "deep-dive": [],
    works: [],
  };

  for (const category of selectedCategories) {
    const availableTags = Object.keys(taxonomy.categories[category].tags);
    const answer = await ask(
      `${taxonomy.categories[category].label} tags [${availableTags.join(", ")}]`,
      "",
    );
    categories[category] = parseCommaSeparated(answer).filter((tag) =>
      availableTags.includes(tag),
    );
  }

  return categories;
}

export async function readArticleDocument(articleFile: string) {
  const source = await readFile(articleFile, "utf8");
  return parseMdxDocument(source);
}

export async function assertPathExists(targetPath: string, message: string) {
  try {
    await access(targetPath);
  } catch {
    throw new Error(message);
  }
}

export function articleFileFromSlug(projectRoot: string, slug: string) {
  return path.join(projectRoot, "content", "articles", slug, "index.mdx");
}
