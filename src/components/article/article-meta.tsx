import { Badge } from "@/shared/ui/badge";

import type { DisplayTag } from "./types";

export function ArticleMeta({
  date,
  tags,
}: {
  date: string;
  tags: readonly DisplayTag[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <time className="text-sm text-muted-foreground" dateTime={date}>
        {date.replaceAll("-", ".")}
      </time>
      {tags.map((tag) => (
        <Badge color={tag.color} key={`${tag.id}-${tag.label}`}>
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}
