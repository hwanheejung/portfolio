import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Callout } from "@/components/mdx/callout";
import { Column, Columns } from "@/components/mdx/columns";
import { Metric } from "@/components/mdx/metric";
import { Numbering } from "@/components/mdx/numbering";
import { SectionHeading } from "@/components/mdx/section-heading";

function renderColumns(count: number) {
  return renderToStaticMarkup(
    createElement(
      Columns,
      null,
      ...Array.from({ length: count }, (_, index) =>
        createElement(Column, { key: index }, `Column ${index + 1}`),
      ),
    ),
  );
}

describe("Columns", () => {
  it("renders between two and six columns", () => {
    expect(renderColumns(2)).toContain('data-column-count="2"');
    expect(renderColumns(6)).toContain('data-column-count="6"');
  });

  it("uses Column widths as relative grid proportions", () => {
    const markup = renderToStaticMarkup(
      createElement(
        Columns,
        null,
        createElement(Column, { width: 1 }, "Narrow"),
        createElement(Column, { width: 2 }, "Wide"),
        createElement(Column, { width: 1 }, "Narrow"),
      ),
    );

    expect(markup).toContain("--mdx-column-template:1fr 2fr 1fr");
  });

  it("allows MDX components inside a column", () => {
    const markup = renderToStaticMarkup(
      createElement(
        Columns,
        null,
        createElement(
          Column,
          null,
          createElement(
            Callout,
            { backgroundColor: "blue", emoji: "💡", title: "Nested" },
            "Callout content",
          ),
        ),
        createElement(Column, null, "Second column"),
      ),
    );

    expect(markup).toContain("Nested");
    expect(markup).toContain("Callout content");
    expect(markup).toContain("bg-sky-400/10");
  });

  it("centers column content when requested", () => {
    const markup = renderToStaticMarkup(
      createElement(
        Columns,
        null,
        createElement(Column, { align: "center" }, "Centered"),
        createElement(Column, null, "Default"),
      ),
    );

    expect(markup).toContain("items-center");
    expect(markup).toContain("text-center");
  });

  it("rejects column counts outside the supported range", () => {
    expect(() => renderColumns(1)).toThrow();
    expect(() => renderColumns(7)).toThrow();
  });
});

describe("Numbering", () => {
  it("renders a zero-padded circular step label", () => {
    const markup = renderToStaticMarkup(
      createElement(Numbering, { value: 1 }),
    );

    expect(markup).toContain('aria-label="Step 1"');
    expect(markup).toContain(">01</span>");
    expect(markup).toContain("rounded-full");
  });
});

describe("Metric", () => {
  it("keeps direction and sentiment as separate meanings", () => {
    const markup = renderToStaticMarkup(
      createElement(Metric, {
        description: "Saved per week",
        direction: "down",
        label: "Manual work",
        sentiment: "positive",
        value: "8h",
      }),
    );

    expect(markup).toContain('data-sentiment="positive"');
    expect(markup).toContain("↓");
    expect(markup).toContain("Saved per week");
  });
});

describe("SectionHeading", () => {
  it("renders an optional eyebrow, title, and divider", () => {
    const markup = renderToStaticMarkup(
      createElement(SectionHeading, {
        eyebrow: "Background",
        title: "Understanding the company and their goals",
      }),
    );

    expect(markup).toContain("Background");
    expect(markup).toContain("Understanding the company and their goals");
    expect(markup).toContain('aria-hidden="true"');
  });

  it("renders without an eyebrow", () => {
    const markup = renderToStaticMarkup(
      createElement(SectionHeading, { title: "Results" }),
    );

    expect(markup).toContain("Results");
    expect(markup).not.toContain("uppercase");
  });
});
