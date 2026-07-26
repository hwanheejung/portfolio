"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  type ArticleCategoryId,
  articleCategoryIds,
  type ArticleSummary,
} from "@schema/article";
import type { Taxonomy } from "@schema/taxonomy";
import { getDisplayTags } from "@/components/article/get-display-tags";
import { Badge } from "@/shared/ui/badge";

type ArticlesByCategory = Record<ArticleCategoryId, ArticleSummary[]>;
type ActiveArticleByCategory = Record<ArticleCategoryId, string | null>;

function getSpotlightArticles(
  articlesByCategory: ArticlesByCategory
): ActiveArticleByCategory {
  return Object.fromEntries(
    articleCategoryIds.map((category) => [
      category,
      articlesByCategory[category].find((article) =>
        article.spotlightIn.includes(category)
      )?.slug ?? null,
    ])
  ) as ActiveArticleByCategory;
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
  category,
  open,
  taxonomy,
  onFocusChange,
  onHoverChange,
  onToggle,
}: {
  article: ArticleSummary;
  category: ArticleCategoryId;
  open: boolean;
  taxonomy: Taxonomy;
  onFocusChange: (slug: string | null) => void;
  onHoverChange: (slug: string | null) => void;
  onToggle: () => void;
}) {
  const categoryTags = getDisplayTags(article, taxonomy, category);
  const allTags = getDisplayTags(article, taxonomy);
  const panelId = `${category}-${article.slug}-details`;

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
              : categoryTags.slice(0, 2).map((tag) => (
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
  articlesByCategory,
  taxonomy,
}: {
  articlesByCategory: ArticlesByCategory;
  taxonomy: Taxonomy;
}) {
  const [pinned, setPinned] = useState<ActiveArticleByCategory>(() =>
    getSpotlightArticles(articlesByCategory)
  );
  const [hovered, setHovered] = useState<ActiveArticleByCategory>(
    () =>
      Object.fromEntries(
        articleCategoryIds.map((category) => [category, null])
      ) as ActiveArticleByCategory
  );
  const [focused, setFocused] = useState<ActiveArticleByCategory>(
    () =>
      Object.fromEntries(
        articleCategoryIds.map((category) => [category, null])
      ) as ActiveArticleByCategory
  );

  const orderedCategories = useMemo(
    () =>
      [...articleCategoryIds].sort(
        (a, b) => taxonomy.categories[a].order - taxonomy.categories[b].order
      ),
    [taxonomy]
  );

  return (
    <div className="space-y-20 md:space-y-28">
      {orderedCategories.map((category) => {
        const categoryData = taxonomy.categories[category];
        const openSlug =
          hovered[category] ?? focused[category] ?? pinned[category];

        return (
          <section
            className="scroll-mt-24 grid gap-8 md:grid-cols-[11rem_1fr] md:gap-14"
            id={category}
            key={category}
          >
            <aside className="article-category-heading md:pt-1">
              <h2 className="display-font max-w-40 text-xl leading-6">
                {categoryData.label}
              </h2>
              <p className="mt-2 max-w-40 text-xs leading-5 text-muted-foreground">
                {categoryData.description}
              </p>
            </aside>

            <div className="article-disclosure-list">
              {articlesByCategory[category].map((article) => (
                <DisclosureArticle
                  article={article}
                  category={category}
                  key={article.slug}
                  onFocusChange={(slug) =>
                    setFocused((current) => ({
                      ...current,
                      [category]: slug,
                    }))
                  }
                  onHoverChange={(slug) =>
                    setHovered((current) =>
                      current[category] === slug
                        ? current
                        : {
                            ...current,
                            [category]: slug,
                          }
                    )
                  }
                  onToggle={() => {
                    setPinned((current) => ({
                      ...current,
                      [category]:
                        current[category] === article.slug
                          ? null
                          : article.slug,
                    }));
                    setFocused((current) => ({
                      ...current,
                      [category]: null,
                    }));
                    setHovered((current) => ({
                      ...current,
                      [category]: null,
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
