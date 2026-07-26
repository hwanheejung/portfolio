import Link from "next/link";

import type { ArticleSummary } from "@schema/article";

import { ArticleMeta } from "./article-meta";
import type { DisplayTag } from "./types";

export function ArticleListItem({
  article,
  tags,
}: {
  article: ArticleSummary;
  tags: readonly DisplayTag[];
}) {
  return (
    <article>
      <Link
        className="article-list-link pressable grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-start md:py-8"
        href={`/articles/${article.slug}`}
      >
        <div className="space-y-3">
          <h3 className="article-list-title text-balance text-xl font-semibold tracking-tight md:text-2xl">
            {article.title}
          </h3>
          {article.description ? (
            <p className="max-w-3xl leading-7 text-muted-foreground">
              {article.description}
            </p>
          ) : null}
          <ArticleMeta date={article.date} tags={tags} />
        </div>
        <span className="article-list-arrow text-xl" aria-hidden="true">
          ↗
        </span>
      </Link>
    </article>
  );
}
