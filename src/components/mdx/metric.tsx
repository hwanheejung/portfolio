import { cn } from "@/shared/lib/cn";

type Props = {
  label: string;
  value: string;
  description?: string;
  suffix?: string;
  direction?: Direction;
  sentiment?: Sentiment;
};

type Direction = "none" | "up" | "down";
type Sentiment = "neutral" | "positive" | "negative";

const Metric = ({
  label,
  value,
  description,
  suffix,
  direction = "none",
  sentiment = "neutral",
}: Props) => {
  const directionSymbol = directionSymbols[direction];

  return (
    <section
      aria-label={`${label}: ${value}`}
      className="my-8 min-h-52 rounded-[1.6rem] border border-white/9 bg-[linear-gradient(145deg,rgb(255_255_255/0.055),transparent_55%),rgb(30_33_27/0.72)] p-[clamp(1.25rem,4vw,2rem)] shadow-[inset_0_1px_0_rgb(255_255_255/0.09),0_18px_50px_rgb(0_0_0/0.16)] backdrop-blur-xl backdrop-saturate-150 @container [@media(prefers-reduced-transparency:reduce)]:bg-card! [@media(prefers-reduced-transparency:reduce)]:[backdrop-filter:none]! contrast-more:border-[#76767e]! contrast-more:bg-background!"
      data-sentiment={sentiment}
    >
      <p className="text-[0.72rem] leading-tight font-[650] tracking-[0.045em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
        <p className="text-[clamp(2rem,17cqi,3.75rem)]! leading-[0.92]! font-[650] tracking-[-0.055em] text-foreground! tabular-nums">
          {value}
        </p>
        {directionSymbol ? (
          <span
            aria-label={`${direction}ward direction`}
            className={cn(
              "mb-[0.15rem] grid size-8 place-items-center rounded-full text-base font-bold",
              directionClasses[sentiment]
            )}
          >
            {directionSymbol}
          </span>
        ) : null}
      </div>
      {suffix ? (
        <p className="mt-[0.55rem] text-sm font-[560] tracking-[-0.01em] text-foreground!">
          {suffix}
        </p>
      ) : null}
      {description ? (
        <p className="mt-6 max-w-lg text-[0.82rem] leading-[1.55] text-muted-foreground">
          {description}
        </p>
      ) : null}
    </section>
  );
};

export { Metric };

const directionSymbols: Record<Direction, string | null> = {
  none: null,
  up: "↑",
  down: "↓",
};

const directionClasses: Record<Sentiment, string> = {
  neutral: "bg-[#8e8e93]/14 text-[#aeaeb2]",
  positive: "bg-[#30d158]/13 text-[#30d158]",
  negative: "bg-[#ff453a]/13 text-[#ff453a]",
};
