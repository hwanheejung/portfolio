import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/article/article-card";
import { ArticleMeta } from "@/components/article/article-meta";
import { ArticleToc } from "@/components/article/article-toc";
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
import { extractArticleToc } from "@/lib/content/toc";

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
    description: article.description,
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
  const articleSource = await readFile(
    path.join(process.cwd(), "content", "articles", slug, "index.mdx"),
    "utf8"
  );
  const articleBody = articleSource.replace(
    /^---\r?\n[\s\S]*?\r?\n---\r?\n?/,
    ""
  );
  const tocItems = extractArticleToc(articleBody);

  return (
    <article className="page-shell">
      <ArticleToc items={tocItems} />
      <header className="mx-auto flex max-w-4xl flex-col items-center border-b border-border py-16 md:py-24">
        <Link
          className="mr-auto text-sm text-muted-foreground"
          href="/articles"
        >
          ← Articles
        </Link>
        <h1 className="mt-10 text-center text-[clamp(2.8rem,8vw,3.5rem)] leading-[1.1] font-[550] tracking-[-0.035em] text-balance">
          {article.title}
        </h1>
        {article.description ? (
          <p className="mt-4 max-w-2xl text-center text-lg leading-[1.6] text-muted-foreground">
            {article.description}
          </p>
        ) : null}
        <div className="mt-8">
          <ArticleMeta
            date={article.date}
            tags={getDisplayTags(article, taxonomy)}
          />
        </div>
      </header>

      <div className="mx-auto max-w-4xl py-12 md:py-20">
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
