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
        className="group grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-start md:py-8"
        href={`/articles/${article.slug}`}
      >
        <div className="space-y-3">
          <h3 className="text-balance text-xl font-semibold tracking-tight transition-transform group-hover:translate-x-1 md:text-2xl">
            {article.title}
          </h3>
          {article.excerpt ? (
            <p className="max-w-3xl leading-7 text-muted-foreground">
              {article.excerpt}
            </p>
          ) : null}
          <ArticleMeta date={article.date} tags={tags} />
        </div>
        <span className="text-xl" aria-hidden="true">
          ↗
        </span>
      </Link>
    </article>
  );
}
