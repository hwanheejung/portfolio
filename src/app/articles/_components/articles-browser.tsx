"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  type ArticleCategoryId,
  articleCategoryIds,
  type ArticleSummary,
} from "@schema/article";
import type { Taxonomy } from "@schema/taxonomy";
import { ArticleCard } from "@/components/article/article-card";
import { getDisplayTags } from "@/components/article/get-display-tags";

import { categoryPresentation } from "../_config/presentation";
import { ArticleFilters } from "./article-filters";

type Selection = Record<ArticleCategoryId, string[]>;
type ArticlesByCategory = Record<ArticleCategoryId, ArticleSummary[]>;

function parseSelection(
  searchParams: URLSearchParams | Readonly<URLSearchParams>,
): Selection {
  return {
    automation:
      searchParams.get("automation")?.split(",").filter(Boolean) ?? [],
    "deep-dive":
      searchParams.get("deep-dive")?.split(",").filter(Boolean) ?? [],
    works: searchParams.get("works")?.split(",").filter(Boolean) ?? [],
  };
}

function CompactArticleRow({
  article,
  category,
  taxonomy,
  tableLike = false,
}: {
  article: ArticleSummary;
  category: ArticleCategoryId;
  taxonomy: Taxonomy;
  tableLike?: boolean;
}) {
  const tags = getDisplayTags(article, taxonomy, category);

  return (
    <article
      className={[
        "grid gap-3 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6",
        tableLike ? "border-b border-border" : "",
      ].join(" ")}
    >
      <Link href={`/articles/${article.slug}`}>
        <h3 className="display-font text-base uppercase">
          {article.title}
        </h3>
        <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">
          {article.excerpt}
        </p>
      </Link>
      <div className="flex min-w-24 flex-wrap gap-2 sm:justify-end">
        {tags.map((tag) => (
          <span
            className="rounded-full border px-2.5 py-1 text-[0.68rem]"
            key={tag.id}
            style={{
              borderColor: tag.color,
              backgroundColor: tag.color,
              color: "#ffffff",
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>
      <time
        className="min-w-24 text-xs text-muted-foreground"
        dateTime={article.date}
      >
        {article.date}
      </time>
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selection = useMemo(
    () => parseSelection(searchParams),
    [searchParams],
  );

  const orderedCategories = useMemo(
    () =>
      [...articleCategoryIds].sort(
        (a, b) =>
          taxonomy.categories[a].order - taxonomy.categories[b].order,
      ),
    [taxonomy],
  );

  const updateSelection = (category: ArticleCategoryId, tag: string) => {
    const current = selection[category];
    const nextTags = current.includes(tag)
      ? current.filter((candidate) => candidate !== tag)
      : [...current, tag];
    const query = new URLSearchParams(searchParams.toString());

    if (nextTags.length > 0) {
      query.set(category, nextTags.join(","));
    } else {
      query.delete(category);
    }

    const nextUrl = query.size > 0 ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <div className="space-y-28 md:space-y-36">
      {orderedCategories.map((category) => {
        const selectedTags = selection[category];
        const articles = articlesByCategory[category].filter(
          (article) =>
            selectedTags.length === 0 ||
            article.categories[category].some((tag) =>
              selectedTags.includes(tag),
            ),
        );
        const categoryData = taxonomy.categories[category];
        const isAutomation = category === "automation";
        const tableLike = categoryPresentation[category] === "table";
        const featuredArticles = isAutomation ? articles.slice(0, 2) : [];
        const listedArticles = isAutomation ? articles.slice(2) : articles;

        return (
          <section
            className="grid gap-8 md:grid-cols-[10rem_1fr] md:gap-14"
            id={category}
            key={category}
          >
            <aside className="md:pt-1">
              <h2 className="display-font max-w-40 text-base uppercase leading-6">
                {categoryData.label}
              </h2>
              <p className="mt-2 max-w-40 text-xs leading-5 text-muted-foreground">
                {categoryData.description}
              </p>
              <div className="my-4 h-px w-full bg-border" />
              <ArticleFilters
                category={category}
                onToggle={(tag) => updateSelection(category, tag)}
                selected={selectedTags}
                taxonomy={taxonomy}
              />
            </aside>

            <div>
              {featuredArticles.length > 0 ? (
                <div className="mb-3 grid gap-3 sm:grid-cols-2">
                  {featuredArticles.map((article) => (
                    <ArticleCard
                      article={article}
                      key={article.slug}
                      tags={getDisplayTags(article, taxonomy, category)}
                    />
                  ))}
                </div>
              ) : null}

              <div className={tableLike ? "border-t border-border" : ""}>
                {listedArticles.map((article) => (
                  <CompactArticleRow
                    article={article}
                    category={category}
                    key={article.slug}
                    tableLike={tableLike}
                    taxonomy={taxonomy}
                  />
                ))}
                {listedArticles.length === 0 &&
                featuredArticles.length === 0 ? (
                  <p className="py-8 text-sm text-muted-foreground">
                    No articles match this filter.
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
