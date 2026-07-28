import type {
  ArticleSummary,
  Taxonomy,
} from "@/__generated__/content";

import type { DisplayTag } from "./types";

export function getDisplayTags(
  article: ArticleSummary,
  taxonomy: Taxonomy,
) {
  const kind = taxonomy.kinds[article.kind];
  const tags: DisplayTag[] = kind
    ? [
        {
          id: article.kind,
          label: kind.singularLabel,
          color: kind.color,
        },
      ]
    : [];

  for (const topicId of article.topics) {
    const topic = taxonomy.topics[topicId];
    if (topic) {
      tags.push({
        id: topicId,
        label: topic.label,
        color: topic.color,
      });
    }
  }

  return tags;
}
