import type { ComponentProps, ReactNode } from "react";

import type { MDXComponents } from "mdx/types";

import { Callout } from "./callout";
import { Column, Columns } from "./columns";
import { Figure } from "./figure";
import { Metric } from "./metric";
import { Numbering } from "./numbering";
import { SectionHeading } from "./section-heading";

type FigureProps = ComponentProps<typeof Figure>;
type Props = {
  children: ReactNode;
};

const baseMdxComponents: MDXComponents = {
  Callout,
  Column,
  Columns,
  Figure,
  Metric,
  Numbering,
  SectionHeading,
};

const createArticleMdxComponents = (slug: string): MDXComponents => {
  return {
    ...baseMdxComponents,
    Figure: (props: FigureProps) => (
      <Figure {...props} src={resolveArticleAsset(slug, props.src)} />
    ),
    img: (props: ComponentProps<"img">) => {
      const source = typeof props.src === "string" ? props.src : "";
      return (
        <Figure
          alt={props.alt ?? ""}
          src={resolveArticleAsset(slug, source)}
        />
      );
    },
  };
};

const MdxProse = ({ children }: Props) => {
  return <div className="article-prose">{children}</div>;
};

export { baseMdxComponents, createArticleMdxComponents, MdxProse };

const resolveArticleAsset = (slug: string, source: string) => {
  if (!source.startsWith("./images/")) {
    return source;
  }

  return `/_content/articles/${slug}/${source.slice(2)}`;
};
