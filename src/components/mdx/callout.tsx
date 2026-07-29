import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type Props = {
  title?: string;
  emoji?: string;
  backgroundColor?: BackgroundColor;
  children?: ReactNode;
};

type BackgroundColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

const Callout = ({
  title,
  emoji,
  backgroundColor = "default",
  children,
}: Props) => {
  return (
    <aside
      className={cn(
        "my-8 flex gap-3 rounded-[1.35rem] border py-5 px-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_16px_42px_rgb(0_0_0/0.1)] backdrop-blur-[20px] backdrop-saturate-145 md:gap-4 md:py-6 md:px-3 [@media(prefers-reduced-transparency:reduce)]:bg-card! [@media(prefers-reduced-transparency:reduce)]:[backdrop-filter:none]! contrast-more:border-[#76767e]! contrast-more:bg-background!",
        backgroundClasses[backgroundColor]
      )}
    >
      {emoji ? (
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center text-lg"
        >
          {emoji}
        </span>
      ) : null}
      <div className="min-w-0">
        {title ? (
          <p className="mb-1.5 font-semibold tracking-[-0.012em] text-foreground">
            {title}
          </p>
        ) : null}
        <div className="leading-7 text-muted-foreground">{children}</div>
      </div>
    </aside>
  );
};

export { Callout };

const backgroundClasses: Record<BackgroundColor, string> = {
  default: "border-border bg-muted/70",
  gray: "border-slate-400/25 bg-slate-400/10",
  brown: "border-amber-800/35 bg-amber-950/35",
  orange: "border-orange-500/30 bg-orange-500/10",
  yellow: "border-yellow-400/25 bg-yellow-400/10",
  green: "border-emerald-400/25 bg-emerald-400/10",
  blue: "border-sky-400/25 bg-sky-400/10",
  purple: "border-violet-400/25 bg-violet-400/10",
  pink: "border-pink-400/25 bg-pink-400/10",
  red: "border-red-400/25 bg-red-400/10",
};
