import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function GridView({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}
