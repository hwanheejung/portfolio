import * as React from "react";

import { cn } from "@/shared/lib/cn";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  default:
    "border border-foreground bg-foreground text-background hover:bg-foreground/85",
  outline:
    "border border-border bg-background text-foreground hover:border-foreground",
  ghost: "border border-transparent bg-transparent hover:bg-muted",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-11 px-5",
  sm: "h-9 px-3 text-sm",
  icon: "size-10",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
