import {
  content,
  type ArticleKindId,
  type ArticleSummary,
  type ArticleTocItem,
  type Experience,
  type WorkSummary,
} from "@/__generated__/content";

export type {
  ArticleKindId,
  ArticleSummary,
  ArticleTocItem,
  Experience,
  WorkSummary,
};

export async function getArticles(options?: { includeDraft?: boolean }) {
  const includeDraft =
    options?.includeDraft ?? process.env.NODE_ENV !== "production";

  return content.articleSlugs
    .map((slug) => content.articlesBySlug[slug])
    .filter((article) => includeDraft || !article.draft);
}

export async function getArticle(
  slug: string,
  options?: { includeDraft?: boolean },
) {
  const article =
    content.articlesBySlug[slug as keyof typeof content.articlesBySlug];
  if (!article) return null;

  const includeDraft =
    options?.includeDraft ?? process.env.NODE_ENV !== "production";
  return includeDraft || !article.draft ? article : null;
}

export async function getExperiences() {
  return content.experienceIds.map(
    (id) => content.experiencesById[id],
  ) as readonly Experience[];
}

export async function getWorks(options?: { includeDraft?: boolean }) {
  const includeDraft =
    options?.includeDraft ?? process.env.NODE_ENV !== "production";

  return content.workSlugs
    .map((slug) => content.worksBySlug[slug])
    .filter((work) => includeDraft || !work.draft);
}

export async function getWork(
  slug: string,
  options?: { includeDraft?: boolean },
) {
  const work = content.worksBySlug[slug as keyof typeof content.worksBySlug];
  if (!work) return null;

  const includeDraft =
    options?.includeDraft ?? process.env.NODE_ENV !== "production";
  return includeDraft || !work.draft ? work : null;
}

export async function getExperienceWorks(experienceId: string) {
  const experience =
    content.experiencesById[
      experienceId as keyof typeof content.experiencesById
    ];
  if (!experience) return [];
  return resolveWorkSlugs(experience.workSlugs);
}

export async function getAbout() {
  return content.about;
}

export async function getTaxonomy() {
  return content.taxonomy;
}

export async function getHomeContent() {
  return {
    experiences: await getExperiences(),
    articles: await getArticles(),
    featuredArticles: await resolveArticleSlugs(
      content.home.featuredArticles,
    ),
    featuredWorks: await resolveWorkSlugs(content.home.featuredWorks),
  };
}

export async function resolveArticleSlugs(slugs: readonly string[]) {
  return slugs.map((slug) => {
    const article =
      content.articlesBySlug[slug as keyof typeof content.articlesBySlug];
    if (!article || article.draft) {
      throw new Error(`Unable to resolve published article "${slug}".`);
    }
    return article;
  });
}

export async function resolveWorkSlugs(slugs: readonly string[]) {
  return slugs.map((slug) => {
    const work =
      content.worksBySlug[slug as keyof typeof content.worksBySlug];
    if (!work || work.draft) {
      throw new Error(`Unable to resolve published work "${slug}".`);
    }
    return work;
  });
}

export function orderArticlesForKind(
  articles: readonly ArticleSummary[],
  kind: ArticleKindId,
) {
  return articles
    .filter((article) => article.kind === kind)
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

export function getArticleToc(slug: string): readonly ArticleTocItem[] {
  return (
    content.articlesBySlug[
      slug as keyof typeof content.articlesBySlug
    ]?.toc ?? []
  );
}

export function getWorkToc(slug: string): readonly ArticleTocItem[] {
  return (
    content.worksBySlug[slug as keyof typeof content.worksBySlug]?.toc ?? []
  );
}
