import { describe, expect, it } from "vitest";

import {
  ArticleMetadataSchema,
  isPublishedArticleComplete,
  SlugSchema,
} from "../schema/article";
import { PlacementSchema } from "../schema/placement";
import { TaxonomySchema } from "../schema/taxonomy";

describe("article schema", () => {
  it("accepts category-scoped tags", () => {
    const article = ArticleMetadataSchema.parse({
      title: "A safe article",
      slug: "safe-article",
      date: "2026-07-23",
      excerpt: "Summary",
      thumbnail: "./images/thumbnail.svg",
      draft: false,
      categories: {
        automation: ["karrot"],
        works: ["karrot"],
      },
      related: [],
    });

    expect(article.categories.automation).toEqual(["karrot"]);
    expect(article.categories["deep-dive"]).toEqual([]);
    expect(isPublishedArticleComplete(article)).toBe(true);
  });

  it("rejects unstable slug formats", () => {
    expect(() => SlugSchema.parse("Not Safe")).toThrow();
    expect(() => SlugSchema.parse("not_safe")).toThrow();
  });
});

describe("taxonomy and placement schemas", () => {
  it("keeps category presentation out of taxonomy", () => {
    const result = TaxonomySchema.safeParse({
      categories: {
        automation: {
          label: "Automation",
          description: "Description",
          order: 1,
          tags: {},
          view: "list",
        },
        "deep-dive": {
          label: "Deep Dive",
          description: "Description",
          order: 2,
          tags: {},
        },
        works: {
          label: "Works",
          description: "Description",
          order: 3,
          tags: {},
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("accepts typed placement slots", () => {
    const placements = PlacementSchema.parse({
      home: {
        featuredWorks: ["work-one"],
        featuredArticles: ["article-one"],
      },
      articles: {
        categoryTop: {
          automation: [],
          "deep-dive": [],
          works: ["work-one"],
        },
      },
      about: {
        featuredExperiences: ["company"],
      },
    });

    expect(placements.home.featuredWorks).toEqual(["work-one"]);
  });
});
