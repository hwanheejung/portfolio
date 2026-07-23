import type { Metadata } from "next";
import Image from "next/image";

import {
  getAbout,
  getPlacements,
  resolveExperienceIds,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "About Hwanhee's background, principles, and experience.",
};

const dummyImages = [
  "/_content/articles/karrot-local-jobs/images/thumbnail.svg",
  "/_content/articles/graphql-cache/images/thumbnail.svg",
  "/_content/articles/dizzycode/images/thumbnail.svg",
  "/_content/articles/automation-system/images/thumbnail.svg",
  "/_content/articles/adder/images/thumbnail.svg",
] as const;

function DummyImage({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-48 overflow-hidden bg-muted ${className}`}
    >
      <Image
        alt=""
        className="object-cover"
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        src={src}
      />
    </div>
  );
}

export default async function AboutPage() {
  const [about, placements] = await Promise.all([
    getAbout(),
    getPlacements(),
  ]);
  const experiences = await resolveExperienceIds(
    placements.about.featuredExperiences,
  );
  const storyBlocks = [
    { label: "Today", body: about.summary.body.join(" ") },
    { label: "Childhood", body: about.history.body.join(" ") },
    { label: "Growth", body: about.leadership.body.join(" ") },
    { label: "Goal", body: about.problemSolving.body.join(" ") },
  ];

  return (
    <div className="page-shell pb-20">
      <h1 className="sr-only">About Hwanhee</h1>

      <section className="grid gap-4 py-12 md:grid-cols-[0.92fr_1.08fr] md:py-20">
        <article className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="space-y-5">
            {storyBlocks.map((block) => (
              <div key={block.label}>
                <h2 className="display-font text-xs uppercase">
                  {block.label}
                </h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="h-fit rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 className="display-font text-xs uppercase">
            Recent experiences
          </h2>
          <div className="mt-5 divide-y divide-border">
            {experiences.map((experience, index) => (
              <div
                className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-3 first:pt-0"
                key={experience.id}
              >
                <div className="relative size-10 overflow-hidden bg-muted">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="2.5rem"
                    src={
                      dummyImages[index % dummyImages.length] ?? dummyImages[0]
                    }
                  />
                </div>
                <p className="text-sm">
                  {experience.organization} | {experience.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {experience.period.start}—{experience.period.end ?? "Now"}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="py-16 md:py-24">
        <p className="display-font text-xs uppercase text-muted-foreground">
          Leadership
        </p>
        <h2 className="display-font mt-3 max-w-3xl text-2xl uppercase md:text-3xl">
          {about.leadership.heading}
        </h2>
        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {dummyImages.slice(0, 3).map((src, index) => (
            <figure key={src}>
              <DummyImage className="aspect-[4/3]" src={src} />
              <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
                {index === 0
                  ? "Vice president · Led a team"
                  : index === 1
                    ? "Speaker · Mentor"
                    : "Community organizer"}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <p className="display-font text-xs uppercase text-muted-foreground">
          Problem solver, change how we work
        </p>
        <h2 className="display-font mt-3 max-w-3xl text-2xl uppercase md:text-3xl">
          {about.problemSolving.heading}
        </h2>
        <div className="mt-9 grid gap-3 md:grid-cols-[1.12fr_0.88fr]">
          <DummyImage
            className="min-h-80 md:min-h-[24rem]"
            src={dummyImages[3]}
          />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 4].map((imageIndex) => (
              <DummyImage
                className="min-h-36"
                key={imageIndex}
                src={dummyImages[imageIndex] ?? dummyImages[0]}
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {about.problemSolving.body[0]}
        </p>
      </section>

      <section className="py-16 md:py-24">
        <p className="display-font text-xs uppercase text-muted-foreground">
          Maker
        </p>
        <h2 className="display-font mt-3 max-w-3xl text-2xl uppercase md:text-3xl">
          {about.maker.heading}
        </h2>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <DummyImage
            className="min-h-72 md:min-h-[24rem]"
            src={dummyImages[4]}
          />
          <DummyImage
            className="min-h-72 md:min-h-[24rem]"
            src={dummyImages[2]}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {about.maker.description}
        </p>
      </section>
    </div>
  );
}
