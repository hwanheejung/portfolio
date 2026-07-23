import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: string;
};

export function Badge({ className, color, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
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
