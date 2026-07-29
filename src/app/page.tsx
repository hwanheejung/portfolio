import Image from "next/image";
import Link from "next/link";

import { getHomeContent } from "@/lib/content";

import { ArticlesMarquee } from "./_components/articles-marquee";
import { HeroCanvas } from "./_components/hero-canvas";

export default async function HomePage() {
  const home = await getHomeContent();

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[100svh] bg-[#0b0c09] text-white">
        <div className="mx-auto grid min-h-[100svh] w-[min(100%-2rem,92rem)] items-center gap-10 pt-28 pb-12 md:grid-cols-[0.92fr_1.08fr] md:gap-16 md:pt-32 md:pb-16">
          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#d6ef6b] uppercase">
              Hwanhee Jung · Product Engineer
            </p>
            <h1 className="mt-6 max-w-3xl text-[clamp(3.35rem,6.4vw,7.4rem)] leading-[0.9] font-[620] tracking-[-0.065em] text-balance">
              I make complex systems feel clear.
            </h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-white/58 md:text-lg md:leading-8">
              Product-minded frontend engineer in Seoul, turning operational
              complexity into calm, useful experiences.
            </p>
            <Link
              className="mt-10 inline-flex rounded-full border border-white/16 bg-white/6 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              href="/work"
            >
              Explore selected work
            </Link>
          </div>

          <div className="relative min-h-[27rem] overflow-hidden rounded-[2rem] border border-white/8 bg-black shadow-[0_40px_100px_rgba(0,0,0,0.36)] md:min-h-[70svh]">
            <HeroCanvas />
            <p className="pointer-events-none absolute right-6 bottom-5 text-[0.64rem] tracking-[0.12em] text-white/35 uppercase">
              Move to reshape the field
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f1ea] py-24 text-[#11120f] md:py-36">
        <div className="mx-auto w-[min(100%-2rem,82rem)]">
          <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-black/45 uppercase">
                Selected work
              </p>
              <h2 className="mt-4 text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.94] font-[620] tracking-[-0.055em]">
                Learning at scale.
              </h2>
            </div>
            <Link
              className="hidden text-sm font-medium underline decoration-black/25 underline-offset-4 md:block"
              href="/work"
            >
              View all work
            </Link>
          </div>

          <div className="space-y-28 md:space-y-40">
            {home.experiences.map((experience, index) => {
              const work = home.featuredWorks.find(
                (item) => item.experienceId === experience.id
              );

              return (
                <article
                  className="grid items-start gap-10 md:grid-cols-[0.72fr_1.28fr] md:gap-20"
                  key={experience.id}
                >
                  <div className="md:sticky md:top-36">
                    <p className="text-xs font-medium tracking-[0.08em] text-black/42 uppercase">
                      0{index + 1} · {experience.period.start}—
                      {experience.period.end ?? "Now"}
                    </p>
                    <h3 className="mt-4 text-4xl font-[620] tracking-[-0.045em] md:text-5xl">
                      {experience.organization}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-black/52">
                      {experience.scale}
                    </p>
                    <div className="mt-10 border-t border-black/14 pt-5">
                      <p className="text-xs font-semibold tracking-[0.1em] text-black/42 uppercase">
                        What I learned
                      </p>
                      <p className="mt-3 max-w-sm text-lg leading-7 font-medium tracking-[-0.02em]">
                        {experience.learning}
                      </p>
                    </div>
                  </div>

                  {work ? (
                    <Link className="group block" href={`/work/${work.slug}`}>
                      <div className="relative aspect-[1.42] overflow-hidden rounded-[1.7rem] bg-[#d9ded1]">
                        {work.thumbnailUrl ? (
                          <Image
                            alt=""
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.018]"
                            fill
                            sizes="(min-width: 768px) 56rem, 100vw"
                            src={work.thumbnailUrl}
                          />
                        ) : null}
                      </div>
                      <div className="mt-5 flex items-start justify-between gap-8">
                        <div>
                          <p className="text-xs font-semibold tracking-[0.1em] text-black/42 uppercase">
                            Featured case study
                          </p>
                          <h4 className="mt-2 max-w-2xl text-2xl leading-tight font-[600] tracking-[-0.035em] md:text-3xl">
                            {work.title}
                          </h4>
                        </div>
                        <span className="mt-1 shrink-0 text-sm font-medium">
                          View
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="relative min-h-[27rem] overflow-hidden rounded-[1.7rem] bg-[#11120f] p-7 text-white md:min-h-[36rem] md:p-10">
                      <div className="flex h-full min-h-[23.5rem] flex-col justify-between md:min-h-[31rem]">
                        <p className="text-xs font-semibold tracking-[0.1em] text-[#d6ef6b] uppercase">
                          Experience overview
                        </p>
                        <div>
                          <p className="text-[clamp(4rem,10vw,8rem)] leading-none font-[620] tracking-[-0.07em] text-white/12">
                            50M
                          </p>
                          <h4 className="mt-5 max-w-xl text-3xl leading-[1.04] font-[600] tracking-[-0.04em] md:text-5xl">
                            Frontend foundations at search scale.
                          </h4>
                          <p className="mt-5 max-w-lg text-sm leading-6 text-white/48 md:text-base md:leading-7">
                            {experience.summary} {experience.highlights[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0f100e] py-24 text-white md:py-36">
        <div className="mx-auto mb-14 flex w-[min(100%-2rem,82rem)] items-end justify-between gap-6 md:mb-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[#d6ef6b] uppercase">
              Articles
            </p>
            <h2 className="mt-4 text-[clamp(3rem,7vw,6.6rem)] leading-[0.9] font-[620] tracking-[-0.06em]">
              Writing
            </h2>
          </div>
          <Link
            className="hidden text-sm font-medium text-white/65 underline decoration-white/25 underline-offset-4 md:block"
            href="/articles"
          >
            Browse all articles
          </Link>
        </div>
        <ArticlesMarquee articles={home.articles} />
      </section>
    </div>
  );
}
