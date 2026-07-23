import { z } from "zod";

import { SlugSchema } from "./article";

export const PlacementSchema = z
  .object({
    home: z
      .object({
        featuredWorks: z.array(SlugSchema),
        featuredArticles: z.array(SlugSchema),
      })
      .strict(),
  })
  .strict();

export type Placements = z.infer<typeof PlacementSchema>;
