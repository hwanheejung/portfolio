---
name: translate-article
description: Translate Korean technical drafts, notes, or Notion pages into natural English portfolio articles for this repository while preserving the source's claims, metaphors, questions, section order, and authorial intent. Use when adding or revising content under content/articles from Korean source material, especially when the result should follow the portfolio's MDX structure and use local images or components such as SectionHeading, Columns, Callout, Quote, and Figure.
---

# Translate Article

## Scope Boundary: Articles, Not Works

This skill is for **Articles**: authored essays, technical notes, and translated
knowledge writing under `content/articles`. It is not a case-study or portfolio
editing workflow.

- Do not optimize an Article for brevity, skimmability, narrative efficiency,
  or a portfolio audience unless the user explicitly requests that editorial
  work.
- Do not apply case-study practices such as removing repetition, synthesizing
  findings, changing the section sequence, or replacing prose with summary
  bullets.
- Article structure is part of the source. Preserve its sentences, emphasis,
  lists, diagrams, and rhetorical pacing.
- For a **Work** or case study under `content/works`, use
  `case-study-principle` instead. Do not use this translation skill as a basis
  for rewriting it.

Turn Korean source material into natural English without turning it into a
different article. Preserve the author's content and rhetoric; improve only the
English expression and the MDX presentation unless the user explicitly asks for
editorial restructuring.

## Non-Negotiable Source Fidelity

Treat fidelity as more important than polish.

- **Never compress content.** Preserve every source sentence, list item,
  nested list item, example, code block, table row, diagram, callout, detail
  block, and conclusion unless the user explicitly names the exact material to
  remove.
- **Never change structure or order.** Keep the source's chapter order,
  subsection order, paragraph order, list hierarchy, and rhetorical sequence.
  A source sequence such as “background → structure → how it works → strengths
  → limitations → significance” must remain that sequence in the article.
- **Never reinterpret the author's intent.** Do not turn a detailed claim into
  a summary, a list into prose, several causes into one cause, or an example
  into a generalized explanation.
- **Do not move a sentence across source blocks.** For example, an explanation
  from “How it works” must not be placed in “Background” or “Structure,” even
  if it would read smoothly there.
- Preserve the source's claims, metaphors, questions, examples, uncertainty,
  tone, and order of ideas.
- Translate headings by preserving their central concept and rhetorical role.
  Do not replace a heading's metaphor or value judgment with a different
  editorial theme. For example, translate “객체를 존중하는 방법” with
  “respecting objects,” not “revealing responsibilities.”
- Do not add principles, caveats, conclusions, examples, or corrections that
  the source does not contain. If technical accuracy needs clarification,
  report it separately or ask before changing the article.
- Do not remove questions, repetition, personal reflection, or strong wording.
  Do not condense adjacent sentences, even when they appear semantically
  similar, unless the user explicitly authorizes that exact condensation.
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
   - map every paragraph, list, nested list, code block, table, Mermaid diagram,
     Callout, Quote, and detail block to its exact source block,
   - record any section the user explicitly asked to delete.
   - Do not start drafting until this map is complete.
3. Inspect `content/articles`, `content/taxonomy.json`, and the MDX component
   registry. Reuse established presentation patterns without changing content.
4. Choose a lowercase kebab-case slug and create
   `content/articles/<slug>/index.mdx` plus
   `content/articles/<slug>/images/`.
5. Translate sentence by sentence into idiomatic English. Changing English word
   order inside a sentence is allowed; moving, merging, splitting, summarizing,
   or deleting source sentences is not.
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

1. Compare the source map top to bottom. Every mapped source block must appear
   exactly once in the article and in the same relative position.
2. Verify that every English heading maps to a source heading and preserves its
   central words, metaphor, and intent.
3. Verify that every Callout, Quote, Figure caption, Mermaid diagram, table,
   detail block, and emphasized sentence has a source basis.
4. Verify that no source sentence, question, list item, nested item, example,
   code block, table row, diagram, or section was removed, merged, or relocated
   except those explicitly excluded by the user.
5. Search for new claims, caveats, examples, conclusions, or explanations.
   Remove any that the user did not request.
6. Verify that changes affect only English phrasing, not content, hierarchy,
   order, or intent.

## Change Disclosure

In the final response, explicitly list every change that is not a direct
sentence-level translation. This includes format conversions, omitted material
authorized by the user, image substitutions, or any unavoidable structural
adaptation. If there are no such changes, state: “No content, structure, order,
or intent was changed; only English phrasing and source-equivalent formatting
were adapted.”

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
