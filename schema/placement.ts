import { z } from "zod";

import { SlugSchema } from "./article";

const CategoryTopSchema = z
  .object({
    automation: z.array(SlugSchema).default([]),
    "deep-dive": z.array(SlugSchema).default([]),
    works: z.array(SlugSchema).default([]),
  })
  .strict();

export const PlacementSchema = z
  .object({
    home: z
      .object({
        featuredWorks: z.array(SlugSchema),
        featuredArticles: z.array(SlugSchema),
      })
      .strict(),
    articles: z
      .object({
        categoryTop: CategoryTopSchema,
      })
      .strict(),
    about: z
      .object({
        featuredExperiences: z.array(SlugSchema),
      })
      .strict(),
  })
  .strict();

export type Placements = z.infer<typeof PlacementSchema>;
