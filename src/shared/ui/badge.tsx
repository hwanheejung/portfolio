import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: string;
};

export function Badge({ className, color, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "technical-font inline-flex items-center rounded-md border px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.05em] leading-none",
        className,
      )}
      style={
        color
          ? ({
              borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
              color,
              ...style,
            } as CSSProperties)
          : style
      }
      {...props}
    />
  );
}
