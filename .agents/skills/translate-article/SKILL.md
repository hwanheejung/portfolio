---
name: translate-article
description: Translate Korean technical drafts, notes, or Notion pages into natural English portfolio articles for this repository while preserving the source's claims, metaphors, questions, section order, and authorial intent. Use when adding or revising content under content/articles from Korean source material, especially when the result should follow the portfolio's MDX structure and use local images or components such as SectionHeading, Columns, Callout, Quote, and Figure.
---

# Translate Article

Turn Korean source material into natural English without turning it into a
different article. Preserve the author's content and rhetoric; improve only the
English expression and the MDX presentation unless the user explicitly asks for
editorial restructuring.

## Non-Negotiable Source Fidelity

Treat fidelity as more important than polish.

- Preserve the source's claims, metaphors, questions, examples, uncertainty,
  tone, and order of ideas.
- Translate headings by preserving their central concept and rhetorical role.
  Do not replace a heading's metaphor or value judgment with a different
  editorial theme. For example, translate “객체를 존중하는 방법” with
  “respecting objects,” not “revealing responsibilities.”
- Do not add principles, caveats, conclusions, examples, or corrections that
  the source does not contain. If technical accuracy needs clarification,
  report it separately or ask before changing the article.
- Do not remove questions, repetition, personal reflection, or strong wording
  merely because a tighter English article would omit them. Condense only when
  the user asks for editing or when two adjacent sentences are semantically
  identical; preserve the rhetorical point.
- Do not turn an interpretation into the author's claim.
- Apply explicit user instructions exactly. If the user says to remove section
  0, remove only that section and preserve the numbering and substance of the
  remaining sections.

## Workflow

1. Read the complete source.
   - If the source is a Notion URL, use the Notion app to search and fetch the
     exact page.
   - Capture the original title, publication date, headings, claims, metaphors,
     examples, code, links, quotes, questions, callouts, and attached images.
2. Build a source map before writing:
   - map every English `#` heading to one original major heading,
   - map every `<SectionHeading>` to one original subsection,
   - map every Callout and Quote to an actual source block, and
   - record any section the user explicitly asked to delete.
3. Inspect `content/articles`, `content/taxonomy.json`, and the MDX component
   registry. Reuse established presentation patterns without changing content.
4. Choose a lowercase kebab-case slug and create
   `content/articles/<slug>/index.mdx` plus
   `content/articles/<slug>/images/`.
5. Translate paragraph by paragraph into idiomatic English. Reorder clauses
   within a paragraph when English requires it, but preserve the paragraph's
   claim and relationship to its neighbors.
6. Add visual structure only where the source already contains a comparison,
   definition, quotation, list, image, or emphasized conclusion. Read
   [references/portfolio-mdx-patterns.md](references/portfolio-mdx-patterns.md)
   for component syntax.
7. Save every article image inside the article's `images` directory and refer to
   it with a relative `./images/...` path.
8. Run the source-fidelity review, then compile and validate the repository.

## Translation Standard

- Prefer direct English syntax, active voice, and short causal statements.
- Rewrite syntax, not substance. Do not replace the author's framing with a
  more general or more sophisticated argument.
- Preserve rhetorical questions when they carry the author's voice. Adjust
  only their English phrasing.
- Preserve deliberate metaphors unless they become unintelligible in English.
  If a metaphor needs replacement, choose the closest equivalent rather than a
  new interpretation.
- Preserve the source's level of confidence. Do not turn a personal observation
  into a universal rule or soften a deliberate claim without permission.
- Keep code behavior unchanged and translate only comments, identifiers when
  safe, and explanatory text.
- Use stable technical capitalization and preserve API or library casing.
- Use Markdown emphasis (`_..._`) only where the source emphasizes a pivotal
  claim or where emphasis faithfully carries the original stress.
- Translate the article title and description closely before optimizing them
  for brevity. Never invent a new thesis for metadata.

## Article Structure

- Use `#` headings for the source's major chapters. Preserve their order and
  numbering unless the user explicitly changes it.
- Use `<SectionHeading title="..." />` for source subsections inside a `#`
  chapter. Do not create a subsection that has no source counterpart merely to
  improve pacing.
- Preserve source lists as lists and parallel comparisons as parallel
  structures.
- Do not add a new introduction or conclusion unless one exists in the source
  or the user requests one.

## Visual and Image Rules

- Use `<Columns>` only when the source presents genuinely parallel material,
  such as builder versus manipulator, before versus after, or OOP versus FP.
- Use `<Callout>` only for a callout, question, definition, warning, or
  emphasized takeaway that exists in the source. The title and body must be
  traceable to that source block.
- Use a blockquote or `<Quote>` only for language quoted or explicitly presented
  as a definition or maxim in the source.
- Never invent a callout such as “A naming test” by synthesizing surrounding
  prose. Keep ordinary translated prose ordinary.
- Use `<Figure>` for source images or generated supporting visuals. Generated
  visuals may illustrate the topic but must not introduce a new claim.
- Reuse suitable source images. Otherwise use the `imagegen` skill for an
  editorial thumbnail or requested visual, then copy the final image into
  `content/articles/<slug>/images/`.
- Published articles require a description and thumbnail. Store the thumbnail
  as `./images/thumbnail-editorial.png` unless an existing pattern requires
  another format.

## Frontmatter

Follow `content/articles/article.schema.json`.

- Set `kind: technical-article` unless the source is clearly a case study.
- Choose `topics` from `content/taxonomy.json`; add a missing taxonomy topic only
  when the source clearly requires it.
- Preserve the source publication date when available.
- Set `related` only to existing articles with a direct conceptual link.
- Keep `spotlightIn: {}` unless the user explicitly requests placement.
- Set `draft: false` only after the description and thumbnail exist and all
  validations pass.

## Source-Fidelity Review

Before validation, compare the finished MDX against the source from top to
bottom.

1. Verify that every English heading maps to a source heading and preserves its
   central words, metaphor, and intent.
2. Verify that every Callout, Quote, Figure caption, and emphasized sentence has
   a source basis.
3. Search for new claims, caveats, examples, or conclusions. Remove any that the
   user did not request.
4. Verify that no source question, example, or section was removed except those
   explicitly excluded by the user.
5. Verify that translation changes affect phrasing rather than meaning.

When uncertain whether a change is translation or editorial rewriting, preserve
the source and ask the user.

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
