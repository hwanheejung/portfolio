"use client";

import type { Taxonomy } from "@schema/taxonomy";
import { Toggle } from "@/shared/ui/toggle";

export function ArticleFilters({
  category,
  selected,
  taxonomy,
  onToggle,
}: {
  category: keyof Taxonomy["categories"];
  selected: readonly string[];
  taxonomy: Taxonomy;
  onToggle: (tag: string) => void;
}) {
  const tags = Object.entries(taxonomy.categories[category].tags);

  return (
    <div
      aria-label={`${taxonomy.categories[category].label} filters`}
      className="flex flex-wrap gap-2"
      role="group"
    >
      {tags.map(([id, tag]) => (
        <Toggle
          key={id}
          onClick={() => onToggle(id)}
          pressed={selected.includes(id)}
          style={
            selected.includes(id)
              ? {
                  backgroundColor: tag.color,
                  borderColor: tag.color,
                  color: "#ffffff",
                }
              : undefined
          }
        >
          {tag.label}
        </Toggle>
      ))}
    </div>
  );
}
