"use client";

import * as React from "react";

import { cn } from "@/shared/lib/cn";

export type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export function Toggle({
  className,
  pressed = false,
  type = "button",
  ...props
}: ToggleProps) {
  return (
    <button
      aria-pressed={pressed}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        pressed
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background hover:border-foreground",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
