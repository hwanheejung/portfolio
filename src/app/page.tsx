import Image from "next/image";
import Link from "next/link";

import type { ArticleSummary } from "@schema/article";
import { ArticleMeta } from "@/components/article/article-meta";
import { getDisplayTags } from "@/components/article/get-display-tags";
import {
  getAbout,
  getPlacements,
  getTaxonomy,
  resolveArticleSlugs,
  resolveExperienceIds,
} from "@/lib/content";
import { WorkshopGlyph } from "./_components/workshop-glyph";

function SectionLabel({
  children,
  number,
}: {
  children: React.ReactNode;
  number: string;
}) {
  return (
    <div className="home-section-heading">
      <span className="section-number">{number}</span>
      <h2 className="display-font home-section-title">{children}</h2>
    </div>
  );
}

function WorkCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="surface interactive-surface artifact-card grid overflow-hidden md:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="flex min-h-52 flex-col p-5 md:p-6">
        <h4 className="display-font text-xl">{article.title}</h4>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="work-card-cta mt-auto w-fit pt-8 text-sm font-medium">
          View project
          <WorkshopGlyph className="ml-1 inline size-3.5" name="arrow" />
        </div>
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
    </Link>
  );
}

export default async function HomePage() {
  const [about, placements, taxonomy] = await Promise.all([
    getAbout(),
    getPlacements(),
    getTaxonomy(),
  ]);
  const experiences = await resolveExperienceIds(
    placements.home.featuredWorks,
  );
  const workArticleSlugs = [
    ...new Set(experiences.flatMap((experience) => experience.articles)),
  ];
  const [workArticles, featuredArticles] = await Promise.all([
    resolveArticleSlugs(workArticleSlugs),
    resolveArticleSlugs(placements.home.featuredArticles),
  ]);
  const workArticleBySlug = new Map(
    workArticles.map((article) => [article.slug, article]),
  );
  const workGroups = experiences
    .map((experience) => ({
      experience,
      articles: experience.articles.flatMap((slug) => {
        const article = workArticleBySlug.get(slug);
        return article ? [article] : [];
      }),
    }))
    .filter((group) => group.articles.length > 0);
  const primaryArticle = featuredArticles[0];
  const secondaryArticles = featuredArticles.slice(1);

  return (
    <div className="page-shell">
      <section className="grid min-h-[calc(100svh-4.5rem)] items-center gap-5 py-14 md:grid-cols-[1.12fr_0.88fr] md:py-20">
        <div>
          <p className="eyebrow mb-5">{about.hero.eyebrow}</p>
          <h1 className="display-font max-w-2xl text-balance text-[clamp(3rem,5.5vw,6.4rem)] leading-[0.95] tracking-[-0.065em]">
            Building <br />{" "}
            <span className="editorial-font text-accent">human</span>
            -centered products through{" "}
            <span className="editorial-font text-accent">software</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground md:text-lg">
            Product-minded frontend engineer based in Seoul, turning complex
            systems into clear, useful experiences.
          </p>
        </div>
      </section>

      <section className="grid gap-10 py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel number="01">Featured work</SectionLabel>
        <div className="space-y-24">
          {workGroups.map((group) => (
            <section key={group.experience.id}>
              <h3 className="display-font text-3xl tracking-[-0.04em]">
                @{group.experience.organization} | {group.experience.role}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                {group.experience.summary}
              </p>
              <div className="mt-7 space-y-4">
                {group.articles.map((article) => (
                  <WorkCard article={article} key={article.slug} />
                ))}
              </div>
              <Link
                className="mt-5 block text-right text-sm"
                href="/articles#works"
              >
                More work at {group.experience.organization}
                <WorkshopGlyph className="ml-1 inline size-3.5" name="arrow" />
              </Link>
            </section>
          ))}
        </div>
      </section>

      <section className="grid gap-10 py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel number="02">
          Featured article
          <span className="text-muted-foreground"> &amp; research</span>
        </SectionLabel>
        <div>
          <div className="mb-5 flex justify-end">
            <Link
              className="article-disclosure-link text-sm font-medium text-accent"
              href="/articles"
            >
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>

          {primaryArticle ? (
            <article>
              <Link
                className="article-feature-main pressable"
                href={`/articles/${primaryArticle.slug}`}
              >
                <div>
                  <h3 className="display-font text-3xl tracking-[-0.04em]">
                    {primaryArticle.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                    {primaryArticle.excerpt}
                  </p>
                  <div className="mt-5">
                    <ArticleMeta
                      date={primaryArticle.date}
                      tags={getDisplayTags(primaryArticle, taxonomy)}
                    />
                  </div>
                  <span className="mt-6 inline-block text-sm font-medium text-accent">
                    Read article{" "}
                    <WorkshopGlyph
                      className="row-arrow ml-1 inline size-3.5"
                      name="arrow"
                    />
                  </span>
                </div>
                <div className="article-feature-media relative aspect-square">
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
              </Link>
            </article>
          ) : null}

          <div className="divide-y divide-border border-t border-border">
            {secondaryArticles.map((article) => (
              <Link
                className="article-index-row pressable grid grid-cols-[1fr_auto] items-center gap-5 px-5 py-5 md:px-8"
                href={`/articles/${article.slug}`}
                key={article.slug}
              >
                <div>
                  <h3 className="display-font text-lg">{article.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                </div>
                <span aria-hidden="true" className="row-arrow text-accent">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
