import { describe, expect, it } from "vitest";

import {
  getArticles,
  getExperiences,
  inspectContent,
  orderArticlesForCategory,
} from "../src/lib/content";

describe("content graph", () => {
  it("validates all source content and references", async () => {
    const result = await inspectContent();

    expect(result.issues).toEqual([]);
    expect(result.snapshot?.articles.length).toBeGreaterThan(0);
    expect(result.snapshot?.experiences.length).toBeGreaterThan(0);
  });

  it("puts spotlight articles before date-sorted articles", async () => {
    const articles = await getArticles({ includeDraft: false });
    const ordered = orderArticlesForCategory(articles, "automation");

    expect(ordered[0]?.slug).toBe("adder");
    expect(
      ordered.slice(1).map((article) => article.date),
    ).toEqual(
      ordered
        .slice(1)
        .map((article) => article.date)
        .toSorted()
        .reverse(),
    );
  });

  it("keeps curated article references on experiences", async () => {
    const experiences = await getExperiences();

    expect(
      experiences.find((experience) => experience.id === "karrot")?.articles,
    ).toContain("karrot-local-jobs");
  });
});
