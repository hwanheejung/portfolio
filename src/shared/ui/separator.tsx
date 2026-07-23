import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

export function Separator({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn("m-0 border-0 border-t border-border", className)}
      {...props}
    />
  );
}
