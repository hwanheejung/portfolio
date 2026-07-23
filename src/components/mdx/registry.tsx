import type { ComponentProps, ReactNode } from "react";

import type { MDXComponents } from "mdx/types";

import { Callout } from "./callout";
import { Circuit } from "./circuit";
import { Figure, type FigureProps } from "./figure";
import { TruthTable } from "./truth-table";

function resolveArticleAsset(slug: string, source: string) {
  if (!source.startsWith("./images/")) {
    return source;
  }

  return `/_content/articles/${slug}/${source.slice(2)}`;
}

export const baseMdxComponents: MDXComponents = {
  Callout,
  Circuit,
  Figure,
  TruthTable,
};

export function createArticleMdxComponents(slug: string): MDXComponents {
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
}

export function MdxProse({ children }: { children: ReactNode }) {
  return <div className="article-prose">{children}</div>;
}
