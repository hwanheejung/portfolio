import type { ReactNode } from "react";

import { z } from "zod";

const CalloutMetadataSchema = z.object({
  title: z.string().min(1).optional(),
});

export function Callout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  CalloutMetadataSchema.parse({ title });

  return (
    <aside className="my-8 rounded-2xl border border-border bg-muted/70 p-5 md:p-6">
      {title ? <p className="mb-2 font-semibold">{title}</p> : null}
      <div className="leading-7 text-muted-foreground">{children}</div>
    </aside>
  );
}
