import type { Metadata } from "next";

import { getAbout, getExperiences } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "About Hwanhee's background, principles, and experience.",
};

function SectionLabel({
  children,
  number,
}: {
  children: React.ReactNode;
  number: string;
}) {
  return (
    <div className="section-marker">
      <span className="section-number">{number}</span>
      <p className="eyebrow">{children}</p>
    </div>
  );
}

export default async function AboutPage() {
  const [about, allExperiences] = await Promise.all([
    getAbout(),
    getExperiences(),
  ]);
  const experiences = allExperiences.toSorted(
    (a, b) =>
      b.period.start.localeCompare(a.period.start) ||
      a.organization.localeCompare(b.organization),
  );
  const narrative = [...about.summary.body, ...about.history.body];
  const perspectives = [
    {
      label: "Leadership",
      heading: about.leadership.heading,
      body: about.leadership.body,
    },
    {
      label: "Problem solving",
      heading: about.problemSolving.heading,
      body: about.problemSolving.body,
    },
    {
      label: "Maker",
      heading: about.maker.heading,
      body: [about.maker.description],
    },
  ];

  return (
    <div className="page-shell pb-20">
      <header className="compact-page-intro">
        <p className="eyebrow">About Hwanhee</p>
        <h1 className="display-font compact-page-title mt-4">
          About Hwanhee
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {about.summary.heading}
        </p>
      </header>

      <section className="grid gap-14 pb-20 pt-4 md:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)] md:pb-28">
        <div>
          <p className="eyebrow">About</p>
          <div className="mt-6 max-w-3xl space-y-5 text-xl leading-8 tracking-[-0.02em] text-muted-foreground md:text-2xl md:leading-9">
            {narrative.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside>
          <p className="eyebrow">Experience</p>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {experiences.map((experience) => (
              <div className="py-5" key={experience.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="display-font text-base">
                    {experience.organization}
                  </p>
                  <p className="technical-font text-[0.66rem] text-muted-foreground">
                    {experience.period.start}—
                    {experience.period.end ?? "Now"}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {experience.role}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {experience.summary}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-10 border-t border-border py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel number="01">How I work</SectionLabel>
        <div className="grid gap-x-10 sm:grid-cols-2">
          {about.principles.map((principle, index) => (
            <article
              className="border-t border-border py-7"
              key={principle.id}
            >
              <p className="technical-font text-[0.62rem] text-accent">
                0{index + 1}
              </p>
              <h2 className="display-font mt-3 text-xl">
                {principle.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-10 border-t border-border py-20 md:grid-cols-[12rem_1fr] md:py-28">
        <SectionLabel number="02">Perspective</SectionLabel>
        <div className="divide-y divide-border border-y border-border">
          {perspectives.map((perspective) => (
            <article
              className="grid gap-4 py-8 md:grid-cols-[9rem_1fr] md:gap-10 md:py-10"
              key={perspective.label}
            >
              <p className="technical-font text-[0.66rem] uppercase tracking-[0.08em] text-accent">
                {perspective.label}
              </p>
              <div>
                <h2 className="display-font max-w-3xl text-2xl tracking-[-0.035em] md:text-4xl">
                  {perspective.heading}
                </h2>
                <div className="mt-4 max-w-2xl space-y-3 text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                  {perspective.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
