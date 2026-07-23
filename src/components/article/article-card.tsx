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
  priority = false,
}: {
  article: ArticleSummary;
  tags: readonly DisplayTag[];
  variant?: "default" | "featured" | "compact";
  priority?: boolean;
}) {
  const isCompact = variant === "compact";

  return (
    <article
      className={cn(
        "artifact-card article-card-link h-full overflow-hidden border border-border bg-card",
        variant === "featured" && "rounded-[1.75rem]",
        isCompact && "compact-featured-card",
      )}
    >
      <Link
        className={cn(
          "h-full",
          isCompact && article.thumbnailUrl
            ? "grid min-h-40 grid-cols-[minmax(0,1fr)_7rem] sm:grid-cols-[minmax(0,1fr)_8rem]"
            : "flex flex-col",
        )}
        href={`/articles/${article.slug}`}
      >
        {article.thumbnailUrl ? (
          <div
            className={cn(
              "relative aspect-5/3 overflow-hidden border-b border-border bg-muted",
              variant === "featured" && "aspect-16/9",
              isCompact &&
                "order-2 aspect-auto min-h-40 border-b-0 border-l border-border",
            )}
          >
            <Image
              alt=""
              className={cn(
                "article-card-media",
                isCompact ? "object-contain p-2" : "object-cover",
              )}
              fill
              priority={priority}
              sizes={
                variant === "featured"
                  ? "(min-width: 768px) 50vw, 100vw"
                  : isCompact
                    ? "(min-width: 640px) 8rem, 7rem"
                    : "100vw"
              }
              src={article.thumbnailUrl}
            />
          </div>
        ) : null}
        <div
          className={cn(
            "flex flex-1 flex-col gap-4 p-5 md:p-6",
            isCompact && "order-1 gap-3 p-4 md:p-5",
          )}
        >
          <ArticleMeta date={article.date} tags={tags} />
          <div className="space-y-2">
            <h3
              className={cn(
                "text-balance text-xl font-semibold tracking-tight md:text-2xl",
                isCompact && "text-base md:text-lg",
              )}
            >
              {article.title}
            </h3>
            {article.excerpt ? (
              <p
                className={cn(
                  "text-pretty leading-7 text-muted-foreground",
                  isCompact && "line-clamp-2 text-sm leading-6",
                )}
              >
                {article.excerpt}
              </p>
            ) : null}
          </div>
          <span
            className={cn(
              "mt-auto pt-4 text-sm font-medium",
              isCompact && "pt-1 text-xs text-accent",
            )}
          >
            Read article <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
