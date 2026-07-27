import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type Point = {
  title: string;
  description: ReactNode;
};

type Props = {
  columns?: 2 | 3;
  items: Point[];
  tone?: "default" | "accent";
  variant?: "default" | "feature" | "list";
};

const PointGrid = ({
  columns = 2,
  items,
  tone = "default",
  variant = "default",
}: Props) => {
  if (variant === "list") {
    return (
      <ul className="my-6 list-none! divide-y divide-border border-y border-border p-0!">
        {items.map((item) => (
          <li className="py-4" key={item.title}>
            <p className="text-base font-semibold tracking-[-0.015em] text-foreground!">
              {item.title}
            </p>
            <p className="mt-1 text-[0.95rem] leading-6 text-muted-foreground!">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "my-6 grid list-none! gap-x-7 gap-y-7 p-0!",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      {items.map((item, index) => (
        <li
          className={cn(
            "border-t border-border",
            variant === "feature" ? "pt-5" : "pt-4",
          )}
          key={item.title}
        >
          {variant === "feature" ? (
            <p className="mb-3 font-mono text-xs tracking-[0.08em] text-accent!">
              {String(index + 1).padStart(2, "0")}
            </p>
          ) : null}
          <div className="flex items-center gap-2.5">
            {variant === "default" ? (
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  tone === "accent" ? "bg-accent" : "bg-muted-foreground",
                )}
              />
            ) : null}
            <p
              className={cn(
                "text-foreground!",
                variant === "feature"
                  ? "text-xl font-medium tracking-[-0.025em]"
                  : "font-semibold tracking-[-0.012em]",
              )}
            >
              {item.title}
            </p>
          </div>
          <p
            className={cn(
              "mt-2 text-muted-foreground!",
              variant === "feature" ? "max-w-md leading-7" : "leading-7",
            )}
          >
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  );
};

export { PointGrid };
