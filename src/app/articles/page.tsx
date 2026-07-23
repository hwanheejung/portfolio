import type { Metadata } from "next";
import { Suspense } from "react";

import {
  type ArticleCategoryId,
  articleCategoryIds,
  type ArticleSummary,
} from "@schema/article";
import {
  getArticles,
  getPlacements,
  getTaxonomy,
  orderArticlesForCategory,
} from "@/lib/content";
import { Skeleton } from "@/shared/ui/skeleton";

import { ArticlesBrowser } from "./_components/articles-browser";

export const metadata: Metadata = {
  title: "Articles",
  description: "Automation, technical deep dives, and selected works.",
};

export default async function ArticlesPage() {
  const [articles, placements, taxonomy] = await Promise.all([
    getArticles(),
    getPlacements(),
    getTaxonomy(),
  ]);

  const articlesByCategory = Object.fromEntries(
    articleCategoryIds.map((category) => [
      category,
      orderArticlesForCategory(
        articles,
        category,
        placements.articles.categoryTop[category],
      ),
    ]),
  ) as Record<ArticleCategoryId, ArticleSummary[]>;

  return (
    <div className="page-shell">
      <h1 className="sr-only">Articles</h1>
      <div className="pb-24 pt-12 md:pb-36 md:pt-20">
        <Suspense
          fallback={
            <div className="space-y-8">
              <Skeleton className="h-20 w-2/3" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <ArticlesBrowser
            articlesByCategory={articlesByCategory}
            taxonomy={taxonomy}
          />
        </Suspense>
      </div>
    </div>
  );
}
