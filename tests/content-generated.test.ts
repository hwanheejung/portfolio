import { describe, expect, it } from "vitest";

import { content } from "@/__generated__/content";

describe("generated content", () => {
  it("keeps home spotlight content ordered and published", () => {
    const articles = content.home.featuredArticles.map(
      (slug) => content.articlesBySlug[slug],
    );
    const works = content.home.featuredWorks.map(
      (slug) => content.worksBySlug[slug],
    );

    expect(articles.every((article) => !article.draft)).toBe(true);
    expect(works.every((work) => !work.draft)).toBe(true);
    expect(articles.map((article) => article.spotlightIn.home)).toEqual(
      [...articles]
        .map((article) => article.spotlightIn.home)
        .toSorted((a, b) => a - b),
    );
    expect(works.map((work) => work.spotlightIn.home)).toEqual(
      [...works]
        .map((work) => work.spotlightIn.home)
        .toSorted((a, b) => a - b),
    );
  });

  it("resolves article and work taxonomy and experience references", () => {
    for (const slug of content.articleSlugs) {
      const article = content.articlesBySlug[slug];

      expect(content.taxonomy.kinds[article.kind]).toBeDefined();
      for (const topic of article.topics) {
        expect(content.taxonomy.topics[topic]).toBeDefined();
      }
    }
    for (const slug of content.workSlugs) {
      const work = content.worksBySlug[slug];
      expect(content.taxonomy.kinds[work.kind]).toBeDefined();
      expect(content.experiencesById[work.experienceId]).toBeDefined();
    }
  });
});
