type Props = {
  title: string;
  eyebrow?: string;
};

const SectionHeading = ({ title, eyebrow }: Props) => {
  return (
    <header className="mt-[clamp(5rem,10vw,7rem)] pb-12">
      {eyebrow ? (
        <p className="m-0 mb-2 text-xs! leading-[1.2] font-medium tracking-[0.08em] text-[color-mix(in_srgb,var(--muted-foreground)_78%,transparent)]! uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="m-0! max-w-240 text-[clamp(1.5625rem,3vw,2rem)]! leading-[1.2]! font-[550]! tracking-[-0.025em]! text-foreground! text-balance">
        {title}
      </h2>
      <div
        aria-hidden="true"
        className="mt-8 h-px w-full bg-[color-mix(in_srgb,var(--muted-foreground)_58%,transparent)]"
      />
    </header>
  );
};

export { SectionHeading };
