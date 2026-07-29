import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleMeta } from "@/components/article/article-meta";
import { ArticleToc } from "@/components/article/article-toc";
import { getDisplayTags } from "@/components/article/get-display-tags";
import {
  createWorkMdxComponents,
  MdxProse,
} from "@/components/mdx/registry";
import {
  getExperiences,
  getTaxonomy,
  getWork,
  getWorks,
  getWorkToc,
} from "@/lib/content";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const works = await getWorks({
    includeDraft: process.env.NODE_ENV !== "production",
  });
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug, {
    includeDraft: process.env.NODE_ENV !== "production",
  });
  return work
    ? { title: work.title, description: work.description }
    : {};
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const [work, taxonomy, experiences] = await Promise.all([
    getWork(slug, {
      includeDraft: process.env.NODE_ENV !== "production",
    }),
    getTaxonomy(),
    getExperiences(),
  ]);
  if (!work) notFound();

  const experience = experiences.find(
    (item) => item.id === work.experienceId,
  );
  const { default: Content } = await import(
    `../../../../content/experiences/${work.experienceId}/works/${slug}/index.mdx`
  );

  return (
    <article className="page-shell">
      <ArticleToc items={getWorkToc(slug)} />
      <header className="mx-auto flex max-w-4xl flex-col items-center border-b border-border pt-36 pb-16 md:pt-44 md:pb-24">
        <Link className="mr-auto text-sm text-muted-foreground" href="/work">
          ← Work
        </Link>
        <p className="mt-10 text-xs font-semibold tracking-[0.1em] text-accent uppercase">
          {experience?.organization} · Case study
        </p>
        <h1 className="mt-5 text-center text-[clamp(2.8rem,8vw,4.8rem)] leading-[1.02] font-[570] tracking-[-0.05em] text-balance">
          {work.title}
        </h1>
        {work.description ? (
          <p className="mt-5 max-w-2xl text-center text-lg leading-[1.6] text-muted-foreground">
            {work.description}
          </p>
        ) : null}
        <div className="mt-8">
          <ArticleMeta
            date={work.date}
            tags={getDisplayTags(work, taxonomy)}
          />
        </div>
      </header>

      <div className="mx-auto max-w-4xl py-12 md:py-20">
        <MdxProse>
          <Content components={createWorkMdxComponents(slug)} />
        </MdxProse>
      </div>
    </article>
  );
}
