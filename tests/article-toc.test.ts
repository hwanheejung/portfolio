import { describe, expect, it } from "vitest";

import { extractArticleToc } from "@/lib/content/toc";

describe("extractArticleToc", () => {
  it("ignores heading-like comments inside fenced code blocks", () => {
    const body = [
      "# GraphQL queries",
      "",
      "```graphql",
      "# Look up by ID",
      "query { user(id: \"123\") { name } }",
      "",
      "# Look up by name",
      "query { user(name: \"Alice\") { id } }",
      "```",
      "",
      "## Closing thoughts",
    ].join("\n");

    expect(extractArticleToc(body)).toEqual([
      {
        id: "graphql-queries",
        level: 1,
        title: "GraphQL queries",
      },
      {
        id: "closing-thoughts",
        level: 2,
        title: "Closing thoughts",
      },
    ]);
  });

  it("ignores tildes-based fenced code blocks", () => {
    const body = ["# Visible", "", "~~~text", "## Hidden", "~~~"].join("\n");

    expect(extractArticleToc(body).map((item) => item.title)).toEqual([
      "Visible",
    ]);
  });

  it("includes headings only through level two", () => {
    const body = [
      "# Section",
      "",
      "## Subsection",
      "",
      "### Detail",
    ].join("\n");

    expect(extractArticleToc(body).map((item) => item.title)).toEqual([
      "Section",
      "Subsection",
    ]);
  });
});
