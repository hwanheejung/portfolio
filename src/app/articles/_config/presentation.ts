import type { ArticleCategoryId } from "@schema/article";

export type CategoryPresentation = "list" | "table";

export const categoryPresentation = {
  automation: "list",
  "deep-dive": "list",
  works: "table",
} satisfies Record<ArticleCategoryId, CategoryPresentation>;
