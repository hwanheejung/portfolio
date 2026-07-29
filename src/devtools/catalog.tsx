import type { ComponentProps, ReactNode } from "react";

import { Callout } from "@/components/mdx/callout";
import { Chart } from "@/components/mdx/chart";
import { Column, Columns } from "@/components/mdx/columns";
import { Figure } from "@/components/mdx/figure";
import { Metric } from "@/components/mdx/metric";
import { Numbering } from "@/components/mdx/numbering";
import { PointGrid } from "@/components/mdx/point-grid";
import { SectionHeading } from "@/components/mdx/section-heading";
import { Table } from "@/components/mdx/table";

type CalloutBackground = NonNullable<
  ComponentProps<typeof Callout>["backgroundColor"]
>;
type MetricProps = ComponentProps<typeof Metric>;

export type DevtoolField = {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select";
  initialValue: string;
  description?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  visibleWhen?: (values: ComponentValues) => boolean;
};

export type ComponentValues = Record<string, string>;

export type MdxComponentDefinition = {
  name: string;
  description: string;
  fields: DevtoolField[];
  createSnippet: (values: ComponentValues) => string;
  renderPreview: (values: ComponentValues) => ReactNode;
};

function quote(value: string) {
  return JSON.stringify(value);
}

function optionalStringProp(name: string, value: string) {
  return value.trim() ? ` ${name}=${quote(value.trim())}` : "";
}

export function getInitialValues(definition: MdxComponentDefinition) {
  return Object.fromEntries(
    definition.fields.map((field) => [field.key, field.initialValue]),
  );
}

export const mdxComponentCatalog: MdxComponentDefinition[] = [
  {
    name: "Callout",
    description: "Highlight context or an important note.",
    fields: [
      {
        key: "title",
        label: "Title",
        type: "text",
        initialValue: "Worth noting",
      },
      {
        key: "emoji",
        label: "Emoji",
        type: "text",
        initialValue: "💡",
      },
      {
        key: "backgroundColor",
        label: "Background",
        type: "select",
        initialValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Gray", value: "gray" },
          { label: "Brown", value: "brown" },
          { label: "Orange", value: "orange" },
          { label: "Yellow", value: "yellow" },
          { label: "Green", value: "green" },
          { label: "Blue", value: "blue" },
          { label: "Purple", value: "purple" },
          { label: "Pink", value: "pink" },
          { label: "Red", value: "red" },
        ],
      },
      {
        key: "content",
        label: "Content",
        type: "textarea",
        initialValue: "Add the supporting context here.",
      },
    ],
    createSnippet: (values) => {
      const backgroundColor =
        (values.backgroundColor as CalloutBackground) || "default";

      return `<Callout${optionalStringProp(
        "title",
        values.title ?? "",
      )}${optionalStringProp("emoji", values.emoji ?? "")}${
        backgroundColor === "default"
          ? ""
          : ` backgroundColor=${quote(backgroundColor)}`
      }>\n  ${
        values.content?.trim() || "Add the supporting context here."
      }\n</Callout>`;
    },
    renderPreview: (values) => (
      <Callout
        backgroundColor={
          (values.backgroundColor as CalloutBackground) || "default"
        }
        emoji={values.emoji?.trim() || undefined}
        title={values.title?.trim() || undefined}
      >
        {values.content?.trim() || "Add the supporting context here."}
      </Callout>
    ),
  },
  {
    name: "Columns",
    description:
      "Arrange two to six Column blocks. Each column accepts Markdown and any MDX component.",
    fields: [
      {
        key: "count",
        label: "Columns",
        type: "select",
        initialValue: "2",
        options: [2, 3, 4, 5, 6].map((count) => ({
          label: `${count} columns`,
          value: String(count),
        })),
      },
      {
        key: "align",
        label: "Content alignment",
        type: "select",
        initialValue: "start",
        options: [
          { label: "Start", value: "start" },
          { label: "Center", value: "center" },
        ],
      },
      {
        key: "gap",
        label: "Column gap",
        type: "select",
        initialValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Wide", value: "wide" },
        ],
      },
      ...Array.from({ length: 6 }, (_, index): DevtoolField => ({
        key: `width${index + 1}`,
        label: `Column ${index + 1} width`,
        type: "number",
        initialValue: "1",
        description: "Relative width between 0 and 12.",
        visibleWhen: (values) =>
          index < Math.min(6, Math.max(2, Number(values.count) || 2)),
      })),
    ],
    createSnippet: (values) => {
      const count = Math.min(6, Math.max(2, Number(values.count) || 2));
      const gapProp = values.gap === "wide" ? ' gap="wide"' : "";
      const columns = Array.from(
        { length: count },
        (_, index) => {
          const width = Math.min(
            12,
            Math.max(0.1, Number(values[`width${index + 1}`]) || 1),
          );
          const widthProp = width === 1 ? "" : ` width={${width}}`;
          const alignProp =
            values.align === "center" ? ' align="center"' : "";

          return `  <Column${widthProp}${alignProp}>\n    Column ${
            index + 1
          } content.\n  </Column>`;
        },
      );

      return `<Columns${gapProp}>\n${columns.join("\n\n")}\n</Columns>`;
    },
    renderPreview: (values) => {
      const count = Math.min(6, Math.max(2, Number(values.count) || 2));

      return (
        <Columns gap={values.gap === "wide" ? "wide" : "default"}>
          {Array.from({ length: count }, (_, index) => (
            <Column
              align={values.align === "center" ? "center" : "start"}
              key={index}
              width={Math.min(
                12,
                Math.max(0.1, Number(values[`width${index + 1}`]) || 1),
              )}
            >
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                Column {index + 1}
              </div>
            </Column>
          ))}
        </Columns>
      );
    },
  },
  {
    name: "Table",
    description:
      "Present a compact comparison or reference table with optional header treatments.",
    fields: [
      {
        key: "headerRow",
        label: "Header row background",
        type: "select",
        initialValue: "yes",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      {
        key: "headerColumn",
        label: "First column background",
        type: "select",
        initialValue: "yes",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
    ],
    createSnippet: (values) => {
      const headerRow = values.headerRow === "yes" ? "\n  headerRow" : "";
      const headerColumn =
        values.headerColumn === "yes" ? "\n  headerColumn" : "";

      return `<Table${headerRow}${headerColumn}
  columns={["Item", "Before", "After"]}
  rows={[
    ["State", "Mutable", "Immutable"],
    ["Rendering", "All at once", "In smaller units"],
  ]}
/>`;
    },
    renderPreview: (values) => (
      <Table
        columns={["Item", "Before", "After"]}
        headerColumn={values.headerColumn === "yes"}
        headerRow={values.headerRow === "yes"}
        rows={[
          ["State", "Mutable", "Immutable"],
          ["Rendering", "All at once", "In smaller units"],
        ]}
      />
    ),
  },
  {
    name: "Numbering",
    description: "Mark a process step with a compact circular number.",
    fields: [
      {
        key: "value",
        label: "Number",
        type: "number",
        initialValue: "1",
      },
    ],
    createSnippet: (values) =>
      `<Numbering value={${Math.max(0, Number(values.value) || 1)}} />`,
    renderPreview: (values) => (
      <Numbering value={Math.max(0, Number(values.value) || 1)} />
    ),
  },
  {
    name: "PointGrid",
    description:
      "Turn a short set of findings, goals, or principles into a scannable grid.",
    fields: [
      {
        key: "columns",
        label: "Columns",
        type: "select",
        initialValue: "2",
        options: [
          { label: "2 columns", value: "2" },
          { label: "3 columns", value: "3" },
        ],
      },
      {
        key: "tone",
        label: "Marker",
        type: "select",
        initialValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Accent", value: "accent" },
        ],
      },
      {
        key: "variant",
        label: "Layout",
        type: "select",
        initialValue: "default",
        options: [
          { label: "Default grid", value: "default" },
          { label: "Feature grid", value: "feature" },
          { label: "Compact list", value: "list" },
        ],
      },
    ],
    createSnippet: (values) =>
      `<PointGrid\n  columns={${values.columns === "3" ? 3 : 2}}\n  variant=${quote(
        values.variant === "feature"
          ? "feature"
          : values.variant === "list"
            ? "list"
            : "default",
      )}\n  tone=${quote(
        values.tone === "accent" ? "accent" : "default",
      )}\n  items={[\n    { title: "First point", description: "One concise explanation." },\n    { title: "Second point", description: "One concise explanation." },\n  ]}\n/>`,
    renderPreview: (values) => (
      <PointGrid
        columns={values.columns === "3" ? 3 : 2}
        items={[
          {
            title: "First point",
            description: "One concise explanation.",
          },
          {
            title: "Second point",
            description: "One concise explanation.",
          },
        ]}
        tone={values.tone === "accent" ? "accent" : "default"}
        variant={
          values.variant === "feature"
            ? "feature"
            : values.variant === "list"
              ? "list"
              : "default"
        }
      />
    ),
  },
  {
    name: "Metric",
    description:
      "Present one outcome with a clear value, direction, and meaning.",
    fields: [
      {
        key: "label",
        label: "Label",
        type: "text",
        initialValue: "Conversion rate",
      },
      {
        key: "value",
        label: "Value",
        type: "text",
        initialValue: "+23%",
      },
      {
        key: "suffix",
        label: "Suffix",
        type: "text",
        initialValue: "",
        description: "A short unit or context shown beneath the value.",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        initialValue: "Compared with the control group.",
      },
      {
        key: "direction",
        label: "Direction",
        type: "select",
        initialValue: "up",
        options: [
          { label: "None", value: "none" },
          { label: "Up", value: "up" },
          { label: "Down", value: "down" },
        ],
      },
      {
        key: "sentiment",
        label: "Sentiment",
        type: "select",
        initialValue: "positive",
        options: [
          { label: "Neutral", value: "neutral" },
          { label: "Positive", value: "positive" },
          { label: "Negative", value: "negative" },
        ],
      },
    ],
    createSnippet: (values) => {
      const lines = [
        "<Metric",
        `  label=${quote(values.label?.trim() || "Metric")}`,
        `  value=${quote(values.value?.trim() || "—")}`,
      ];

      if (values.suffix?.trim()) {
        lines.push(`  suffix=${quote(values.suffix.trim())}`);
      }
      if (values.description?.trim()) {
        lines.push(`  description=${quote(values.description.trim())}`);
      }
      if (values.direction && values.direction !== "none") {
        lines.push(`  direction=${quote(values.direction)}`);
      }
      if (values.sentiment && values.sentiment !== "neutral") {
        lines.push(`  sentiment=${quote(values.sentiment)}`);
      }

      lines.push("/>");
      return lines.join("\n");
    },
    renderPreview: (values) => (
      <Metric
        description={values.description?.trim() || undefined}
        direction={
          (values.direction as MetricProps["direction"]) || "none"
        }
        label={values.label?.trim() || "Metric"}
        sentiment={
          (values.sentiment as MetricProps["sentiment"]) || "neutral"
        }
        suffix={values.suffix?.trim() || undefined}
        value={values.value?.trim() || "—"}
      />
    ),
  },
  {
    name: "Chart",
    description: "Render a minimal, reusable multi-series line chart.",
    fields: [],
    createSnippet: () =>
      `<Chart\n  ariaLabel="Monthly values"\n  caption="Data source or time range"\n  series={[\n    { label: "All", values: [92, 101, 98], color: "foreground" },\n    { label: "Experiment", values: [7, 9, 8], color: "accent" },\n  ]}\n  xTicks={[\n    { index: 0, label: "Jan" },\n    { index: 2, label: "Mar" },\n  ]}\n  yMax={120}\n/>`,
    renderPreview: () => (
      <Chart
        ariaLabel="Example monthly values"
        caption="Example data"
        series={[
          {
            color: "foreground",
            label: "All",
            values: [92, 101, 98],
          },
          {
            color: "accent",
            label: "Experiment",
            values: [7, 9, 8],
          },
        ]}
        xTicks={[
          { index: 0, label: "Jan" },
          { index: 2, label: "Mar" },
        ]}
        yMax={120}
      />
    ),
  },
  {
    name: "Figure",
    description: "Render an optimized image with an optional caption.",
    fields: [
      {
        key: "src",
        label: "Source",
        type: "text",
        initialValue: "/hero/hero.avif",
        description: "Use ./images/… for an article-local asset.",
      },
      {
        key: "alt",
        label: "Alt text",
        type: "text",
        initialValue: "Describe the image",
      },
      {
        key: "caption",
        label: "Caption",
        type: "text",
        initialValue: "",
      },
      {
        key: "width",
        label: "Width",
        type: "number",
        initialValue: "1200",
      },
      {
        key: "height",
        label: "Height",
        type: "number",
        initialValue: "720",
      },
    ],
    createSnippet: (values) => {
      const lines = [
        `<Figure`,
        `  src=${quote(values.src?.trim() || "./images/example.png")}`,
        `  alt=${quote(values.alt?.trim() || "")}`,
      ];

      if (values.caption?.trim()) {
        lines.push(`  caption=${quote(values.caption.trim())}`);
      }

      lines.push(
        `  width={${Number(values.width) || 1200}}`,
        `  height={${Number(values.height) || 720}}`,
        `/>`,
      );

      return lines.join("\n");
    },
    renderPreview: (values) => (
      <Figure
        alt={values.alt?.trim() || ""}
        caption={values.caption?.trim() || undefined}
        height={Number(values.height) || 720}
        src={values.src?.trim() || "/hero/hero.avif"}
        width={Number(values.width) || 1200}
      />
    ),
  },
  {
    name: "SectionHeading",
    description:
      "Introduce a new article section with an optional eyebrow and divider.",
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow",
        type: "text",
        initialValue: "Background",
        description: "Optional. Leave empty to show only the title.",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
        initialValue: "Understanding the company and their goals",
      },
    ],
    createSnippet: (values) => {
      const eyebrow = values.eyebrow?.trim();
      const title = values.title?.trim() || "Section title";

      return `<SectionHeading${
        eyebrow ? `\n  eyebrow=${quote(eyebrow)}` : ""
      }\n  title=${quote(title)}\n/>`;
    },
    renderPreview: (values) => (
      <SectionHeading
        eyebrow={values.eyebrow?.trim() || undefined}
        title={values.title?.trim() || "Section title"}
      />
    ),
  },
];
