import { describe, expect, it } from "vitest";

import {
  parseCommaSeparated,
  titleFromSlug,
} from "../scripts/article-utils";

describe("article CLI helpers", () => {
  it("creates a readable default title", () => {
    expect(titleFromSlug("graphql-cache")).toBe("Graphql Cache");
  });

  it("normalizes comma-separated selections", () => {
    expect(parseCommaSeparated("react, graphql,react")).toEqual([
      "react",
      "graphql",
    ]);
  });
});
