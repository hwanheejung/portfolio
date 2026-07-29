"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  type ArticleKindId,
  type ArticleSummary,
  type Taxonomy,
} from "@/__generated__/content";
import { getDisplayTags } from "@/components/article/get-display-tags";
import { Badge } from "@/shared/ui/badge";

type ArticlesByKind = Record<ArticleKindId, ArticleSummary[]>;
type ActiveArticleByKind = Record<ArticleKindId, string | null>;

function getSpotlightArticles(
  articlesByKind: ArticlesByKind,
  kindIds: readonly ArticleKindId[],
): ActiveArticleByKind {
  return Object.fromEntries(
    kindIds.map((kind) => [
      kind,
      articlesByKind[kind][0]?.slug ?? null,
    ])
  ) as ActiveArticleByKind;
}

function DisclosureChevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="article-disclosure-chevron size-5"
      data-open={open}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="m5.5 7.5 4.5 4.5 4.5-4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DisclosureArticle({
  article,
  kind,
  open,
  taxonomy,
  onFocusChange,
  onHoverChange,
  onToggle,
}: {
  article: ArticleSummary;
  kind: ArticleKindId;
  open: boolean;
  taxonomy: Taxonomy;
  onFocusChange: (slug: string | null) => void;
  onHoverChange: (slug: string | null) => void;
  onToggle: () => void;
}) {
  const allTags = getDisplayTags(article, taxonomy);
  const panelId = `${kind}-${article.slug}-details`;

  return (
    <article
      className="article-disclosure"
      data-open={open}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onFocusChange(null);
        }
      }}
      onFocus={() => onFocusChange(article.slug)}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          onHoverChange(null);
        }
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse") {
          onHoverChange(article.slug);
        }
      }}
    >
      <Link
        aria-label={`Read ${article.title}`}
        className="article-disclosure-hit-area"
        href={`/articles/${article.slug}`}
      />

      <div className="article-disclosure-trigger">
        <div className="article-disclosure-summary">
          <span className="min-w-0">
            <span className="display-font article-disclosure-title">
              {article.title}
            </span>
          </span>

          <span className="hidden flex-wrap justify-end gap-2 md:flex">
            {open
              ? null
              : allTags.slice(0, 2).map((tag) => (
                  <Badge color={tag.color} key={tag.id}>
                    {tag.label}
                  </Badge>
                ))}
          </span>

          <time
            className="technical-font text-[0.68rem] text-muted-foreground"
            dateTime={article.date}
          >
            {article.date.replaceAll("-", ".")}
          </time>
        </div>

        <button
          aria-controls={panelId}
          aria-expanded={open}
          aria-label={`${article.title} preview`}
          className="article-disclosure-toggle pressable"
          onClick={onToggle}
          type="button"
        >
          <DisclosureChevron open={open} />
        </button>
      </div>

      <div
        aria-hidden={!open}
        aria-label={`${article.title} preview`}
        className="article-disclosure-panel"
        id={panelId}
        role="region"
      >
        <div className="article-disclosure-clip">
          <div className="article-disclosure-content">
            <div className="flex min-w-0 flex-col">
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                {article.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge color={tag.color} key={`${tag.id}-${tag.label}`}>
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>

            {article.thumbnailUrl ? (
              <div className="article-disclosure-media relative min-h-36 overflow-hidden bg-muted">
                <Image
                  alt=""
                  className="object-contain p-3"
                  fill
                  sizes="(min-width: 640px) 11rem, 100vw"
                  src={article.thumbnailUrl}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ArticlesBrowser({
  articlesByKind,
  taxonomy,
}: {
  articlesByKind: ArticlesByKind;
  taxonomy: Taxonomy;
}) {
  const kindIds = useMemo(
    () => Object.keys(taxonomy.kinds) as ArticleKindId[],
    [taxonomy],
  );
  const [pinned, setPinned] = useState<ActiveArticleByKind>(() =>
    getSpotlightArticles(articlesByKind, kindIds)
  );
  const [hovered, setHovered] = useState<ActiveArticleByKind>(
    () =>
      Object.fromEntries(
        kindIds.map((kind) => [kind, null])
      ) as ActiveArticleByKind
  );
  const [focused, setFocused] = useState<ActiveArticleByKind>(
    () =>
      Object.fromEntries(
        kindIds.map((kind) => [kind, null])
      ) as ActiveArticleByKind
  );

  const orderedKinds = useMemo(
    () =>
      [...kindIds].sort(
        (a, b) => taxonomy.kinds[a]!.order - taxonomy.kinds[b]!.order
      ).filter((kind) => articlesByKind[kind].length > 0),
    [articlesByKind, kindIds, taxonomy]
  );

  return (
    <div className="space-y-20 md:space-y-28">
      {orderedKinds.map((kind) => {
        const kindData = taxonomy.kinds[kind];
        if (!kindData) return null;
        const openSlug =
          hovered[kind] ?? focused[kind] ?? pinned[kind];

        return (
          <section
            className="scroll-mt-24 grid gap-8 md:grid-cols-[11rem_1fr] md:gap-14"
            id={kind}
            key={kind}
          >
            <aside className="article-category-heading md:pt-1">
              <h2 className="display-font max-w-40 text-xl leading-6">
                {kindData.label}
              </h2>
              <p className="mt-2 max-w-40 text-xs leading-5 text-muted-foreground">
                {kindData.description}
              </p>
            </aside>

            <div className="article-disclosure-list">
              {articlesByKind[kind].map((article) => (
                <DisclosureArticle
                  article={article}
                  kind={kind}
                  key={article.slug}
                  onFocusChange={(slug) =>
                    setFocused((current) => ({
                      ...current,
                      [kind]: slug,
                    }))
                  }
                  onHoverChange={(slug) =>
                    setHovered((current) =>
                      current[kind] === slug
                        ? current
                        : {
                            ...current,
                            [kind]: slug,
                          }
                    )
                  }
                  onToggle={() => {
                    setPinned((current) => ({
                      ...current,
                      [kind]:
                        current[kind] === article.slug
                          ? null
                          : article.slug,
                    }));
                    setFocused((current) => ({
                      ...current,
                      [kind]: null,
                    }));
                    setHovered((current) => ({
                      ...current,
                      [kind]: null,
                    }));
                  }}
                  open={openSlug === article.slug}
                  taxonomy={taxonomy}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
