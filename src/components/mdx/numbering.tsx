type Props = {
  value: number | string;
};

const Numbering = ({ value }: Props) => {
  const label = String(value).padStart(2, "0");

  return (
    <span
      aria-label={`Step ${value}`}
      className="inline-grid size-16 shrink-0 place-items-center rounded-full border border-accent/15 bg-accent/10 text-xl leading-none font-[550] text-accent tabular-nums shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
    >
      {label}
    </span>
  );
};

export { Numbering };
