import type { ComponentProps, ReactNode } from "react";

import type { MDXComponents } from "mdx/types";

import { Callout } from "./callout";
import { Chart } from "./chart";
import { Column, Columns } from "./columns";
import { Figure } from "./figure";
import { Metric } from "./metric";
import { Numbering } from "./numbering";
import { PointGrid } from "./point-grid";
import { Quote } from "./quote";
import { SectionHeading } from "./section-heading";
import { Table } from "./table";
import { WhiteText } from "./white-text";
import { createHeadingId } from "@/lib/content/toc";

type FigureProps = ComponentProps<typeof Figure>;
type Props = {
  children: ReactNode;
};

const baseMdxComponents: MDXComponents = {
  Callout,
  Chart,
  Column,
  Columns,
  Figure,
  Metric,
  Numbering,
  PointGrid,
  blockquote: Quote,
  SectionHeading,
  Table,
  em: WhiteText,
};

const createContentMdxComponents = (
  collection: "articles" | "works",
  slug: string,
): MDXComponents => {
  return {
    ...baseMdxComponents,
    h1: ({ children, ...props }: ComponentProps<"h1">) => (
      <h1 id={createHeadingId(String(children))} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentProps<"h2">) => (
      <h2 id={createHeadingId(String(children))} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentProps<"h3">) => (
      <h3 id={createHeadingId(String(children))} {...props}>
        {children}
      </h3>
    ),
    Figure: (props: FigureProps) => (
      <Figure {...props} src={resolveContentAsset(collection, slug, props.src)} />
    ),
    img: (props: ComponentProps<"img">) => {
      const source = typeof props.src === "string" ? props.src : "";
      return (
        <Figure
          alt={props.alt ?? ""}
          src={resolveContentAsset(collection, slug, source)}
        />
      );
    },
  };
};

const createArticleMdxComponents = (slug: string): MDXComponents =>
  createContentMdxComponents("articles", slug);

const createWorkMdxComponents = (slug: string): MDXComponents =>
  createContentMdxComponents("works", slug);

const MdxProse = ({ children }: Props) => {
  return <div className="article-prose">{children}</div>;
};

export {
  baseMdxComponents,
  createArticleMdxComponents,
  createWorkMdxComponents,
  MdxProse,
};

const resolveContentAsset = (
  collection: "articles" | "works",
  slug: string,
  source: string,
) => {
  if (!source.startsWith("./images/")) {
    return source;
  }

  return `/_content/${collection}/${slug}/${source.slice(2)}`;
};
