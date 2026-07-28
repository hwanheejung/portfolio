export type ArticleTocItem = {
  id: string;
  level: 1 | 2 | 3;
  title: string;
};

export function createHeadingId(title: string) {
  return title
    .toLocaleLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractArticleToc(body: string): ArticleTocItem[] {
  const headings: ArticleTocItem[] = [];
  const proseOnly = body
    .replace(
      /^(?: {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?: {0,3})\1[ \t]*$/gm,
      ""
    )
    .replace(/`[^`\n]+`/g, "");
  const matches = proseOnly.matchAll(
    /^(#{1,3})\s+(.+?)\s*$|<SectionHeading\s+[^>]*title=(?:"([^"]+)"|'([^']+)')[^>]*\/>/gm
  );

  for (const match of matches) {
    const markdownLevel = match[1]?.length;
    const title = (match[2] ?? match[3] ?? match[4] ?? "")
      .replace(/\s+#+$/, "")
      .trim();

    if (!title) continue;

    headings.push({
      id: createHeadingId(title),
      level: markdownLevel
        ? (Math.min(markdownLevel, 3) as 1 | 2 | 3)
        : 2,
      title,
    });
  }

  return headings;
}
