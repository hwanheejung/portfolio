import Image from "next/image";
import Link from "next/link";

import type { ArticleSummary } from "@schema/article";
import { cn } from "@/shared/lib/cn";

import { ArticleMeta } from "./article-meta";
import type { DisplayTag } from "./types";

export function ArticleCard({
  article,
  tags,
  variant = "default",
}: {
  article: ArticleSummary;
  tags: readonly DisplayTag[];
  variant?: "default" | "featured";
}) {
  return (
    <article
      className={cn(
        "group h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground",
        variant === "featured" && "rounded-[1.75rem]"
      )}
    >
      <Link className="flex h-full flex-col" href={`/articles/${article.slug}`}>
        {article.thumbnailUrl ? (
          <div
            className={cn(
              "relative aspect-5/3 overflow-hidden border-b border-border bg-muted",
              variant === "featured" && "aspect-16/9"
            )}
          >
            <Image
              alt=""
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              fill
              sizes={
                variant === "featured"
                  ? "(min-width: 768px) 50vw, 100vw"
                  : "100vw"
              }
              src={article.thumbnailUrl}
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
          <ArticleMeta date={article.date} tags={tags} />
          <div className="space-y-2">
            <h3 className="text-balance text-xl font-semibold tracking-tight md:text-2xl">
              {article.title}
            </h3>
            {article.excerpt ? (
              <p className="text-pretty leading-7 text-muted-foreground">
                {article.excerpt}
              </p>
            ) : null}
          </div>
          <span className="mt-auto pt-4 text-sm font-medium">
            Read article <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
