---
name: case-study-principle
description: Structure, write, review, and improve product or engineering portfolio case studies (Works) so they are concise, visual, evidence-led, and easy to scan. Use for content under content/works when drafting sections, reducing prose, organizing research and synthesis, choosing columns or visualizations, designing reusable MDX components, or reviewing an existing case study for narrative clarity.
---

# Case Study Principle — Works Only

This is a **Work/case-study** skill, not an Article editing or translation
skill. Its compression, synthesis, and narrative-reordering practices apply
only when the user asks to create or revise a case study under `content/works`.
Never apply them to `content/articles`, including translated technical essays.

Create case studies that reveal the argument before asking the reader to study the details. Prefer short framing, scannable points, and one-purpose visuals over uninterrupted prose.

## Workflow

1. Read the complete article and inspect the rendered page when available.
2. Identify the single job of every section.
3. Remove repeated information across Background, Research, Synthesis, captions, and visuals.
4. Rewrite dense passages as short lead-ins and structured points.
5. Reuse existing MDX components before creating a new one.
6. Create a component only when its pattern will be useful in multiple sections or articles.
7. Run only content validation, type checking, and lint unless broader QA is explicitly requested.

## Narrative Structure

Use this default sequence when it fits the story:

1. **Overview** — Timeline, role, type, and scope.
2. **Background** — Why the project began and what ownership the author took.
3. **Process** — A compact map of the journey, not a second table of contents.
4. **Research** — Incidents first, then evidence.
5. **Synthesis** — Connected conditions, one problem statement, goals, and principles.
6. **Building** — Decisions, key features, and system architecture.
7. **Operation** — Pilot, iteration, and emerging use cases.
8. **Reflection** — Outcomes, tradeoffs, and learning.

Adjust the sequence when the evidence supports a clearer argument. Do not preserve a section merely because the template contains it.

## Writing Principles

- Open each major section with at most one or two framing sentences.
- Prefer short noun phrases for headings: `Operations`, not `How the work actually flowed`.
- Keep one idea per bullet and aim for no more than two lines on desktop.
- Start explanatory bullets with a scan anchor:

  `**Independent control** — Change rollout without another deployment.`

- Use active, concrete language. Name the actor, dependency, failure, or consequence.
- Separate observation from interpretation:
  - Research shows what happened.
  - Synthesis explains what the events had in common.
- Use captions for source, scope, or context. Do not repeat the visual's conclusion at length.
- Remove duplicated claims even when they use different wording.
- Preserve enough incident detail for the reader to feel the problem before presenting abstraction.

## Visual Hierarchy

Build each section from the smallest useful combination:

1. Short heading
2. One- or two-sentence setup
3. Three to five bullets, a compact grid, or one visual
4. Optional one-line caption

Use:

- `Columns` for parallel information, comparisons, metadata, or text paired with a chart.
- `PointGrid` for findings, goals, principles, or other short repeated concepts.
- `Callout` for one decisive problem statement or conclusion.
- `Chart` for quantitative relationships over time.
- `Figure` when an incident, workflow, or piece of evidence is easier to understand visually.
- `Numbering` for a short ordered process.

Do not add a visualization when a short list communicates the relationship just as well.

## Visual Language

- Let one dominant relationship carry each visualization.
- Keep explanatory prose outside images.
- Use foreground text for the primary message and muted text for support.
- Reserve the accent color for transitions, selected points, causes, or important series.
- Use icons only when they encode categories, roles, states, or actions.
- Use one consistent icon family. Do not use emoji as a substitute for a coherent icon system.
- Avoid decorative cards, icons, borders, or backgrounds that do not improve comprehension.
- Preserve readable contrast and do not copy low-contrast reference styling literally.

## Component Rules

- Inspect `src/components/mdx` and the devtool catalog before adding anything.
- Keep styling inside the component with Tailwind utilities.
- Minimize global CSS and do not duplicate component styles in devtools.
- Render the real component in devtools.
- Register new MDX components in the runtime registry, content allowlist, and devtool catalog.
- Keep component files in this order:

  1. Types
  2. Main component
  3. Export
  4. Subcomponents and helpers

- Use TypeScript props. Do not add Zod validation to presentation components without a concrete runtime boundary that requires it.
- Preserve Markdown freedom inside components where practical. Prefer simple data props only for short, repeated content.

## Review Checklist

Before finishing, confirm:

- The reader can understand the argument by scanning headings and bold lead phrases.
- Background establishes initiative without duplicating Research.
- Research contains concrete incidents and evidence.
- Synthesis introduces abstraction only after evidence.
- Every visual answers one clear question.
- Bullets and captions do not restate the same claim.
- New components are reusable and appear in devtools.
- No `design-qa` or other temporary QA document was created.
- Content validation, type checking, and lint report no errors.
