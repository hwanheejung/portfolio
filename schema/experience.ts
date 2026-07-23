import { z } from "zod";

import { SlugSchema } from "./article";

const PeriodSchema = z
  .object({
    start: z.string().trim().min(1),
    end: z.string().trim().min(1).nullable(),
  })
  .strict();

export const ExperienceSchema = z
  .object({
    id: SlugSchema,
    organization: z.string().trim().min(1),
    role: z.string().trim().min(1),
    period: PeriodSchema,
    summary: z.string().trim().min(1),
    articles: z.array(SlugSchema).default([]),
    highlights: z.array(z.string().trim().min(1)).default([]),
    images: z.array(z.string().trim().min(1)).default([]),
  })
  .strict();

export type Experience = z.infer<typeof ExperienceSchema>;
