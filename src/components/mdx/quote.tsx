import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type Props = ComponentProps<"blockquote">;

const Quote = ({ children, className, ...props }: Props) => {
  return (
    <blockquote
      className={cn(
        "my-9 border-l-3 border-accent py-1 pl-5 font-medium text-foreground [&_p]:m-0 [&_p]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  );
};

export { Quote };
