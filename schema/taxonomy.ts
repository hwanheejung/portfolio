import { z } from "zod";

const TagSchema = z
  .object({
    label: z.string().trim().min(1),
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex color."),
  })
  .strict();

const CategorySchema = z
  .object({
    label: z.string().trim().min(1),
    description: z.string().trim().min(1),
    order: z.number().int().positive(),
    tags: z.record(z.string(), TagSchema),
  })
  .strict();

export const TaxonomySchema = z
  .object({
    categories: z
      .object({
        automation: CategorySchema,
        "deep-dive": CategorySchema,
        works: CategorySchema,
      })
      .strict(),
  })
  .strict();

export type Taxonomy = z.infer<typeof TaxonomySchema>;
export type TaxonomyTag = z.infer<typeof TagSchema>;
