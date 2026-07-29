import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getExperiences, getWorks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected product and engineering case studies.",
};

export default async function WorkPage() {
  const [works, experiences] = await Promise.all([
    getWorks(),
    getExperiences(),
  ]);

  return (
    <div className="page-shell pt-32 pb-24 md:pt-44 md:pb-36">
      <header className="max-w-4xl">
        <p className="eyebrow">Selected work</p>
        <h1 className="mt-5 text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.9] font-[620] tracking-[-0.065em]">
          Systems made human.
        </h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
          Product and engineering work where understanding the operating
          context mattered as much as shipping the interface.
        </p>
      </header>

      <div className="mt-20 space-y-16 md:mt-28">
        {works.map((work) => {
          const experience = experiences.find(
            (item) => item.id === work.experienceId,
          );
          return (
            <Link
              className="group grid gap-6 border-t border-border pt-7 md:grid-cols-[0.72fr_1.28fr] md:gap-14"
              href={`/work/${work.slug}`}
              key={work.slug}
            >
              <div>
                <p className="text-xs font-semibold tracking-[0.1em] text-accent uppercase">
                  {experience?.organization} · {work.date.slice(0, 4)}
                </p>
                <h2 className="mt-4 max-w-lg text-3xl leading-[1.05] font-[600] tracking-[-0.04em] md:text-5xl">
                  {work.title}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                  {work.description}
                </p>
              </div>
              <div className="relative aspect-[1.45] overflow-hidden rounded-[1.5rem] bg-muted">
                {work.thumbnailUrl ? (
                  <Image
                    alt=""
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.018]"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    src={work.thumbnailUrl}
                  />
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
