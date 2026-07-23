import { describe, expect, it } from "vitest";

import {
  parseMdxDocument,
  serializeMdxDocument,
} from "../src/lib/content/frontmatter";

describe("MDX frontmatter", () => {
  it("round-trips YAML metadata and the raw MDX body", () => {
    const source = `---
title: Example
slug: example
---

## Heading

<Callout title="Note">Body</Callout>
`;
    const parsed = parseMdxDocument(source);
    const serialized = serializeMdxDocument(parsed.data, parsed.body);
    const reparsed = parseMdxDocument(serialized);

    expect(reparsed.data).toEqual({
      title: "Example",
      slug: "example",
    });
    expect(reparsed.body).toContain("<Callout");
  });

  it("requires frontmatter at the start of an article", () => {
    expect(() => parseMdxDocument("# Missing frontmatter")).toThrow(
      /frontmatter/,
    );
  });
});
