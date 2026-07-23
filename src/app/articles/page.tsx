import type { Metadata } from "next";
import { Suspense } from "react";

import {
  type ArticleCategoryId,
  articleCategoryIds,
  type ArticleSummary,
} from "@schema/article";
import {
  getArticles,
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
  const [articles, taxonomy] = await Promise.all([
    getArticles(),
    getTaxonomy(),
  ]);

  const articlesByCategory = Object.fromEntries(
    articleCategoryIds.map((category) => [
      category,
      orderArticlesForCategory(articles, category),
    ]),
  ) as Record<ArticleCategoryId, ArticleSummary[]>;

  return (
    <div className="page-shell">
      <header className="compact-page-intro">
        <p className="eyebrow">Writing &amp; selected work</p>
        <h1 className="display-font compact-page-title mt-4">
          Articles
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          Notes on product engineering, automation, and the systems behind
          thoughtful digital experiences.
        </p>
      </header>
      <div className="pb-24 md:pb-32">
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
