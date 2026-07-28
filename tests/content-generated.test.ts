import { describe, expect, it } from "vitest";

import { content } from "@/__generated__/content";

describe("generated content", () => {
  it("keeps home spotlight content ordered and published", () => {
    const articles = content.home.featuredContent.map(
      (slug) => content.articlesBySlug[slug],
    );

    expect(articles.every((article) => !article.draft)).toBe(true);
    expect(articles.map((article) => article.spotlightIn.home)).toEqual(
      [...articles]
        .map((article) => article.spotlightIn.home)
        .toSorted((a, b) => a - b),
    );
  });

  it("resolves every article taxonomy and experience reference", () => {
    for (const slug of content.articleSlugs) {
      const article = content.articlesBySlug[slug];

      expect(content.taxonomy.kinds[article.kind]).toBeDefined();
      for (const topic of article.topics) {
        expect(content.taxonomy.topics[topic]).toBeDefined();
      }
      for (const experienceId of article.experienceIds) {
        expect(content.experiencesById[experienceId]).toBeDefined();
      }
    }
  });
});
