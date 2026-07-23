import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/article/article-card";
import { ArticleMeta } from "@/components/article/article-meta";
import { getDisplayTags } from "@/components/article/get-display-tags";
import { GridView } from "@/components/collection/grid-view";
import {
  createArticleMdxComponents,
  MdxProse,
} from "@/components/mdx/registry";
import {
  getArticle,
  getArticles,
  getTaxonomy,
  resolveArticleSlugs,
} from "@/lib/content";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getArticles({
    includeDraft: process.env.NODE_ENV !== "production",
  });
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug, {
    includeDraft: process.env.NODE_ENV !== "production",
  });

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, taxonomy] = await Promise.all([
    getArticle(slug, {
      includeDraft: process.env.NODE_ENV !== "production",
    }),
    getTaxonomy(),
  ]);

  if (!article) {
    notFound();
  }

  const [{ default: Content }, relatedArticles] = await Promise.all([
    import(`../../../../content/articles/${slug}/index.mdx`),
    resolveArticleSlugs(article.related),
  ]);

  return (
    <article className="page-shell">
      <header className="mx-auto max-w-4xl border-b border-border py-16 md:py-24">
        <Link className="text-sm text-muted-foreground" href="/articles">
          ← Articles
        </Link>
        <h1 className="mt-10 text-balance text-[clamp(2.8rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
          {article.title}
        </h1>
        {article.excerpt ? (
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            {article.excerpt}
          </p>
        ) : null}
        <div className="mt-8">
          <ArticleMeta
            date={article.date}
            tags={getDisplayTags(article, taxonomy)}
          />
        </div>
      </header>

      <div className="mx-auto max-w-3xl py-12 md:py-20">
        <MdxProse>
          <Content components={createArticleMdxComponents(slug)} />
        </MdxProse>
      </div>

      {relatedArticles.length > 0 ? (
        <section className="border-t border-border py-16 md:py-24">
          <p className="mb-3 text-sm uppercase tracking-[0.16em] text-muted-foreground">
            Related Articles
          </p>
          <h2 className="mb-8 text-3xl font-semibold tracking-[-0.04em]">
            Keep reading
          </h2>
          <GridView>
            {relatedArticles.map((related) => (
              <ArticleCard
                article={related}
                key={related.slug}
                tags={getDisplayTags(related, taxonomy)}
              />
            ))}
          </GridView>
        </section>
      ) : null}
    </article>
  );
}
