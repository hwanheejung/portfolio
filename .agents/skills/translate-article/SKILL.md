---
name: translate-article
description: Translate Korean technical drafts, notes, or Notion pages into natural English portfolio articles for this repository. Use when adding or revising content under content/articles from Korean source material, especially when the result should follow the portfolio's MDX structure, use local images, and apply components such as SectionHeading, Columns, Callout, Quote, and Figure.
---

# Translate Article

Turn Korean source material into an English article that reads as if it was
written in English. Preserve the author's argument and technical accuracy while
adapting sentence structure, pacing, and visual hierarchy to this portfolio.

## Workflow

1. Read the complete source.
   - If the source is a Notion URL, use the Notion app to search and fetch the
     exact page.
   - Capture the original title, publication date, claims, examples, code,
     links, quotes, and attached images.
2. Inspect `content/articles`, `content/taxonomy.json`, and the MDX component
   registry before writing. Reuse established patterns.
3. Choose a lowercase kebab-case slug and create
   `content/articles/<slug>/index.mdx` plus
   `content/articles/<slug>/images/`.
4. Outline the English argument before translating. Give each major section one
   job and remove duplicated setup or conclusions.
5. Write idiomatic English rather than translating sentence by sentence.
6. Add visual structure only where it improves comprehension. Read
   [references/portfolio-mdx-patterns.md](references/portfolio-mdx-patterns.md)
   for the component rules and examples.
7. Save every article image inside the article's `images` directory and refer to
   it with a relative `./images/...` path.
8. Compile the content and run the repository's article, content, type, and lint
   checks.

## Translation Standard

- Preserve the author's position, technical meaning, uncertainty, and level of
  confidence. Do not invent evidence or stronger conclusions.
- Rewrite at the paragraph level. Prefer direct English syntax, active voice,
  and short causal statements.
- Remove Korean discourse patterns that sound translated in English, including
  repeated rhetorical questions, duplicated conclusions, and phrases such as
  “to examine this more clearly” when a direct transition works.
- Prefer `This can lead to an unexpected bug.` over a staged construction such
  as `That assumption breaks... The result can be an unexpected bug.`
- Use stable technical capitalization: `side effect`, `pure function`,
  `referential transparency`, `functional programming`; preserve API and
  library casing.
- Keep code executable and comments in English. Improve formatting without
  changing the behavior being explained.
- Use Markdown emphasis (`_..._`) for one or two pivotal claims per major
  section. Emphasize conclusions and turning points, not ordinary terms.
- Keep the title and description concise, specific, and natural in English.

## Article Structure

- Use `#` headings for major chapters only. Follow the numbering style already
  established by the closest related article.
- Use `<SectionHeading title="..." />` for every meaningful subdivision inside
  a `#` chapter. Do not introduce raw `##` headings for article sections.
- Open each major chapter with no more than one or two framing sentences.
- Use bullets for three or more parallel facts, risks, requirements, or
  takeaways. Keep each bullet focused on one idea.
- Use a short closing section that resolves the opening question without
  repeating the entire article.

## Visual and Image Rules

- Use `<Columns>` only for genuinely parallel material: before/after images,
  alternatives, comparisons, or text paired with a supporting visual. Do not
  force every article to contain columns.
- Use `<Callout>` for a definition, decisive principle, warning, or concise
  takeaway that deserves visual priority.
- Use a blockquote or `<Quote>` only for real quoted language, a formula, or a
  brief statement whose voice matters. Do not turn ordinary prose into a quote
  for decoration.
- Use `<Figure>` for local screenshots, diagrams, generated illustrations, and
  other evidence. Write useful `alt`, `caption`, `width`, and `height` values.
- Reuse source images when they are suitable. Otherwise use the `imagegen` skill
  to create an editorial thumbnail or explanatory visual, then copy the final
  file into `content/articles/<slug>/images/`.
- Published articles require a description and thumbnail. Store the thumbnail
  as `./images/thumbnail-editorial.png` unless an existing article pattern
  clearly calls for another format.
- Do not add a visual, callout, quote, or column layout merely to satisfy a
  checklist. Every element must make a relationship or conclusion easier to
  understand.

## Frontmatter

Follow `content/articles/article.schema.json`.

- Set `kind: technical-article` unless the source is clearly a case study.
- Choose `topics` only from `content/taxonomy.json`.
- Preserve the source publication date when available.
- Set `related` to existing article slugs with a meaningful conceptual link.
- Keep `spotlightIn: {}` unless the user explicitly requests placement.
- Set `draft: false` only after the description and thumbnail exist and all
  validations pass.

## Validation

Run:

```bash
pnpm content:compile
pnpm article:check <slug>
pnpm content:check
pnpm typecheck
pnpm lint
```

Fix failures before handing off. Report the article path, image paths, selected
topic tags, and validation result.
