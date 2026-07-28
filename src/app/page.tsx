import Image from "next/image";
import Link from "next/link";

import type {
  ArticleSummary,
  Taxonomy,
} from "@/__generated__/content";
import { ArticleMeta } from "@/components/article/article-meta";
import { getDisplayTags } from "@/components/article/get-display-tags";
import {
  getAbout,
  getHomeContent,
  getTaxonomy,
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

function FeaturedContentCard({
  article,
  taxonomy,
}: {
  article: ArticleSummary;
  taxonomy: Taxonomy;
}) {
  const kind = taxonomy.kinds[article.kind];

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="surface interactive-surface artifact-card grid overflow-hidden md:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="flex min-h-52 flex-col p-5 md:p-6">
        <h4 className="display-font text-xl">{article.title}</h4>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {article.description}
        </p>
        <div className="mt-5">
          <ArticleMeta
            date={article.date}
            tags={getDisplayTags(article, taxonomy)}
          />
        </div>
        <div className="work-card-cta mt-auto w-fit pt-8 text-sm font-medium">
          Read {kind?.singularLabel.toLocaleLowerCase() ?? "article"}
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
  const [about, home, taxonomy] = await Promise.all([
    getAbout(),
    getHomeContent(),
    getTaxonomy(),
  ]);

  return (
    <div className="page-shell">
      <section className="grid min-h-[calc(100svh-4.5rem)] items-center gap-5 py-14 md:grid-cols-[1.12fr_0.88fr] md:py-20">
        <div>
          <p className="eyebrow mb-5">{about.hero.eyebrow}</p>
          <h1 className="display-font max-w-2xl text-balance text-[clamp(3rem,5.5vw,6.4rem)] leading-[0.95] tracking-[-0.065em]">
            {about.hero.heading}
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground md:text-lg">
            {about.hero.description}
          </p>
        </div>
      </section>

      <section className="grid gap-10 py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel number="01">Work experience</SectionLabel>
        <div className="divide-y divide-border border-y border-border">
          {home.experiences.map((experience) => (
            <article
              className="grid gap-5 py-8 md:grid-cols-[10rem_1fr] md:py-10"
              key={experience.id}
            >
              <div>
                <p className="technical-font text-xs text-accent">
                  {experience.period.start} — {experience.period.end ?? "Now"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {experience.role}
                </p>
              </div>
              <div>
                <h3 className="display-font text-3xl tracking-[-0.04em]">
                  {experience.organization}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {experience.summary}
                </p>
                {experience.highlights.length > 0 ? (
                  <ul className="mt-5 space-y-2 text-sm leading-6 text-muted-foreground">
                    {experience.highlights.map((highlight) => (
                      <li className="flex gap-3" key={highlight}>
                        <span aria-hidden="true" className="text-accent">
                          —
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-10 py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel number="02">Featured work &amp; writing</SectionLabel>
        <div>
          <div className="mb-5 flex justify-end">
            <Link
              className="article-disclosure-link text-sm font-medium text-accent"
              href="/articles"
            >
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {home.featuredContent.map((article) => (
              <FeaturedContentCard
                article={article}
                key={article.slug}
                taxonomy={taxonomy}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
