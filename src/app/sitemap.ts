import type { MetadataRoute } from "next";

import { getArticles, getWorks } from "@/lib/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [articles, works] = await Promise.all([
    getArticles({ includeDraft: false }),
    getWorks({ includeDraft: false }),
  ]);

  return [
    {
      url: origin,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${origin}/work`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${origin}/articles`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${origin}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...articles.map((article) => ({
      url: `${origin}/articles/${article.slug}`,
      lastModified: article.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...works.map((work) => ({
      url: `${origin}/work/${work.slug}`,
      lastModified: work.date,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
