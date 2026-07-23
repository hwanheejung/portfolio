import type { ArticleCategoryId, ArticleSummary } from "@schema/article";
import type { Taxonomy } from "@schema/taxonomy";

import type { DisplayTag } from "./types";

export function getDisplayTags(
  article: ArticleSummary,
  taxonomy: Taxonomy,
  category?: ArticleCategoryId,
) {
  const categories = category
    ? [category]
    : (Object.keys(article.categories) as ArticleCategoryId[]);
  const seen = new Set<string>();
  const tags: DisplayTag[] = [];

  for (const categoryId of categories) {
    for (const tagId of article.categories[categoryId]) {
      const tag = taxonomy.categories[categoryId].tags[tagId];
      const key = `${tagId}-${tag?.label}`;

      if (!tag || seen.has(key)) {
        continue;
      }

      seen.add(key);
      tags.push({
        id: tagId,
        label: tag.label,
        color: tag.color,
      });
    }
  }

  return tags;
}
