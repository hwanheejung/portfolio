import Image from "next/image";
import Link from "next/link";

import type { ArticleSummary } from "@schema/article";
import type { Taxonomy } from "@schema/taxonomy";
import { ArticleMeta } from "@/components/article/article-meta";
import { getDisplayTags } from "@/components/article/get-display-tags";
import {
  getAbout,
  getPlacements,
  getTaxonomy,
  resolveArticleSlugs,
} from "@/lib/content";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="display-font text-sm uppercase tracking-tight md:text-base">
      {children}
    </p>
  );
}

function WorkCard({
  article,
  eyebrow,
}: {
  article: ArticleSummary;
  eyebrow: string;
}) {
  return (
    <article className="grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[1.15fr_0.85fr]">
      <div className="flex min-h-52 flex-col p-5 md:p-6">
        <p className="display-font text-xs uppercase text-muted-foreground">
          {eyebrow}
        </p>
        <h4 className="display-font mt-5 text-xl uppercase">
          {article.title}
        </h4>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {article.excerpt}
        </p>
        <Link
          className="mt-auto pt-8 text-sm underline-offset-4 hover:underline"
          href={`/articles/${article.slug}`}
        >
          → view detail
        </Link>
      </div>
      <div className="relative min-h-52 border-t border-border bg-muted md:border-t-0 md:border-l">
        {article.thumbnailUrl ? (
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 768px) 32rem, 100vw"
            src={article.thumbnailUrl}
          />
        ) : null}
      </div>
    </article>
  );
}

function groupWorks(articles: ArticleSummary[], taxonomy: Taxonomy) {
  const groups = new Map<
    string,
    { id: string; label: string; articles: ArticleSummary[] }
  >();

  for (const article of articles) {
    const id = article.categories.works[0] ?? "works";
    const label = taxonomy.categories.works.tags[id]?.label ?? "Works";
    const group = groups.get(id) ?? { id, label, articles: [] };
    group.articles.push(article);
    groups.set(id, group);
  }

  return [...groups.values()];
}

export default async function HomePage() {
  const [about, placements, taxonomy] = await Promise.all([
    getAbout(),
    getPlacements(),
    getTaxonomy(),
  ]);
  const [featuredWorks, featuredArticles] = await Promise.all([
    resolveArticleSlugs(placements.home.featuredWorks),
    resolveArticleSlugs(placements.home.featuredArticles),
  ]);
  const workGroups = groupWorks(featuredWorks, taxonomy);
  const primaryArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1);
  const heroImage = featuredWorks[0]?.thumbnailUrl;

  return (
    <div className="page-shell">
      <section className="grid min-h-[34rem] items-center gap-12 py-12 md:grid-cols-[1fr_0.82fr] md:py-20">
        <div>
          <p className="display-font mb-5 text-sm uppercase">
            {about.hero.eyebrow}
          </p>
          <h1 className="display-font max-w-xl text-balance text-[clamp(2.6rem,6vw,5.4rem)] uppercase leading-[1.06]">
            {about.hero.heading}
          </h1>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-[30%] bg-muted">
            {heroImage ? (
              <Image
                alt=""
                className="object-cover"
                fill
                priority
                sizes="(min-width: 768px) 28rem, 85vw"
                src={heroImage}
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-16 md:grid-cols-[12rem_1fr] md:py-20">
        <SectionLabel>About me</SectionLabel>
        <div className="max-w-2xl space-y-4 text-base leading-7 text-muted-foreground">
          {about.summary.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="grid gap-8 py-16 md:grid-cols-[12rem_1fr] md:py-20">
        <SectionLabel>How I work</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          {about.principles.map((principle, index) => (
            <article
              className={[
                "min-h-48 rounded-2xl border border-border bg-card p-5 md:p-6",
                index === 2 ? "sm:col-span-1" : "",
              ].join(" ")}
              key={principle.id}
            >
              <h3 className="display-font text-base uppercase">
                {principle.title}
              </h3>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-10 py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel>Featured work</SectionLabel>
        <div className="space-y-24">
          {workGroups.map((group) => (
            <section key={group.id}>
              <h2 className="display-font text-2xl uppercase">
                @{group.label} | Selected work
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                A short overview of the context, my role, and the outcome of
                this work.
              </p>
              <div className="mt-10 space-y-4">
                {group.articles.map((article, index) => (
                  <WorkCard
                    article={article}
                    eyebrow={index % 2 === 0 ? "Product" : "Team"}
                    key={article.slug}
                  />
                ))}
              </div>
              <Link
                className="mt-5 block text-right text-sm"
                href={`/articles?works=${group.id}#works`}
              >
                more works in {group.label} →
              </Link>
            </section>
          ))}
        </div>
      </section>

      <section className="grid gap-10 py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel>
          Featured article
          <br />&amp; research
        </SectionLabel>
        <div>
          {primaryArticle ? (
            <article className="grid gap-6 md:grid-cols-[1fr_10rem]">
              <div>
                <h2 className="display-font text-2xl uppercase">
                  {primaryArticle.title}
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
                  {primaryArticle.excerpt}
                </p>
                <div className="mt-5">
                  <ArticleMeta
                    date={primaryArticle.date}
                    tags={getDisplayTags(primaryArticle, taxonomy)}
                  />
                </div>
                <Link
                  className="mt-5 inline-block text-sm"
                  href={`/articles/${primaryArticle.slug}`}
                >
                  Read Full Article →
                </Link>
              </div>
              <div className="relative aspect-square overflow-hidden bg-muted">
                {primaryArticle.thumbnailUrl ? (
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="10rem"
                    src={primaryArticle.thumbnailUrl}
                  />
                ) : null}
              </div>
            </article>
          ) : null}

          <div className="mt-10 divide-y divide-border">
            {secondaryArticles.map((article) => (
              <Link
                className="grid grid-cols-[1fr_auto] gap-5 py-5"
                href={`/articles/${article.slug}`}
                key={article.slug}
              >
                <div>
                  <h3 className="display-font text-lg uppercase">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                </div>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <Link className="mt-7 block text-right text-sm" href="/articles">
            view all →
          </Link>
        </div>
      </section>
    </div>
  );
}
