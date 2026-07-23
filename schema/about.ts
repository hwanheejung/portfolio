import { z } from "zod";

const NarrativeSchema = z
  .object({
    heading: z.string().trim().min(1),
    body: z.array(z.string().trim().min(1)).min(1),
  })
  .strict();

export const AboutSchema = z
  .object({
    hero: z
      .object({
        eyebrow: z.string().trim().min(1),
        heading: z.string().trim().min(1),
        image: z.string().trim().min(1).optional(),
      })
      .strict(),
    summary: NarrativeSchema,
    principles: z
      .array(
        z
          .object({
            id: z.string().trim().min(1),
            title: z.string().trim().min(1),
            description: z.string().trim().min(1),
          })
          .strict(),
      )
      .min(1),
    history: NarrativeSchema,
    leadership: NarrativeSchema,
    problemSolving: NarrativeSchema,
    maker: z
      .object({
        heading: z.string().trim().min(1),
        description: z.string().trim().min(1),
        gallery: z.array(z.string().trim().min(1)).default([]),
      })
      .strict(),
  })
  .strict();

export type About = z.infer<typeof AboutSchema>;
