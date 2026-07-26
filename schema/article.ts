import { z } from "zod";

export const articleCategoryIds = ["automation", "deep-dive", "works"] as const;

export const ArticleCategoryIdSchema = z.enum(articleCategoryIds);
export type ArticleCategoryId = z.infer<typeof ArticleCategoryIdSchema>;

export const SlugSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase kebab-case characters only."
  );

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date (YYYY-MM-DD).")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), {
    message: "Use a valid calendar date.",
  });

export const ArticleCategoriesSchema = z
  .object({
    automation: z.array(SlugSchema).default([]),
    "deep-dive": z.array(SlugSchema).default([]),
    works: z.array(SlugSchema).default([]),
  })
  .strict()
  .default({
    automation: [],
    "deep-dive": [],
    works: [],
  });

export const ArticleMetadataSchema = z
  .object({
    title: z.string().trim().min(1),
    slug: SlugSchema,
    date: DateSchema,
    description: z.string().trim().min(1).optional(),
    thumbnail: z.string().trim().min(1).optional(),
    draft: z.boolean().default(true),
    categories: ArticleCategoriesSchema,
    spotlightIn: z.array(ArticleCategoryIdSchema).default([]),
    related: z.array(SlugSchema).default([]),
  })
  .strict();

export type ArticleMetadata = z.infer<typeof ArticleMetadataSchema>;

export type ArticleSummary = ArticleMetadata & {
  thumbnailUrl?: string;
};

export function isPublishedArticleComplete(article: ArticleMetadata) {
  const hasCategory = articleCategoryIds.some(
    (category) => article.categories[category].length > 0
  );

  return Boolean(article.description && article.thumbnail && hasCategory);
}
