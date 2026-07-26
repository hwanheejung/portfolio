import type { ComponentProps, ReactNode } from "react";

import { Callout } from "@/components/mdx/callout";
import { Column, Columns } from "@/components/mdx/columns";
import { Figure } from "@/components/mdx/figure";
import { Metric } from "@/components/mdx/metric";
import { SectionHeading } from "@/components/mdx/section-heading";

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
      const columns = Array.from(
        { length: count },
        (_, index) => {
          const width = Math.min(
            12,
            Math.max(0.1, Number(values[`width${index + 1}`]) || 1),
          );
          const widthProp = width === 1 ? "" : ` width={${width}}`;

          return `  <Column${widthProp}>\n    Column ${
            index + 1
          } content.\n  </Column>`;
        },
      );

      return `<Columns>\n${columns.join("\n\n")}\n</Columns>`;
    },
    renderPreview: (values) => {
      const count = Math.min(6, Math.max(2, Number(values.count) || 2));

      return (
        <Columns>
          {Array.from({ length: count }, (_, index) => (
            <Column
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
