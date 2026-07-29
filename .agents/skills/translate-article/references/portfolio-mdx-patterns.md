# Portfolio MDX Patterns

Use these patterns after inspecting the closest existing article. They document
the current component API; they are not quotas.

## SectionHeading

Use inside a major `#` chapter instead of a raw `##` heading.

```mdx
# 2. Referential Transparency

<SectionHeading title="When the Hidden Effect Becomes Visible" />
```

Add `eyebrow` only when a small category label provides useful context:

```mdx
<SectionHeading eyebrow="Tradeoff" title="Safer Caching with a Closure" />
```

## Columns

`Columns` requires two to six direct `Column` children. `width` accepts a
positive number up to 12; `align` can be `start` or `center`.

```mdx
<Columns>
  <Column>
    <Figure
      src="./images/before.png"
      alt="Schema before the refactor."
      caption="Before: operation-oriented names."
      width={1142}
      height={214}
    />
  </Column>
  <Column>
    <Figure
      src="./images/after.png"
      alt="Schema after the refactor."
      caption="After: graph-oriented entry points."
      width={1142}
      height={178}
    />
  </Column>
</Columns>
```

For an asymmetric text-and-image layout:

```mdx
<Columns gap="wide">
  <Column width={5}>
    Explain the decision and the constraint it addresses.
  </Column>
  <Column width={7}>
    <Figure
      src="./images/architecture.png"
      alt="Architecture showing the state boundary."
      caption="Mutable state remains inside the module boundary."
      width={1280}
      height={720}
    />
  </Column>
</Columns>
```

## Callout

Use for one compact idea. Available background colors are `default`, `gray`,
`brown`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, and `red`.

```mdx
<Callout title="What is referential transparency?" backgroundColor="purple">
  Replacing an expression with its value does not change the program's
  behavior.
</Callout>
```

An emoji is optional. Avoid it unless it adds a meaningful category or warning
signal.

## Table

Use `Table` for comparison or reference tables. Set either background treatment
only when the source has a header row or a label column.

```mdx
<Table
  headerRow
  headerColumn
  columns={["Item", "Before", "After"]}
  rows={[["State", "Mutable", "Immutable"]]}
/>
```

## Quote

Standard Markdown blockquotes render through the repository's `Quote`
component:

```md
> If a tree falls in the forest, but no one is around to hear it, does it still
> make a sound?
```

Explicit MDX is also valid:

```mdx
<Quote>
  A brief statement whose wording or voice is important.
</Quote>
```

Do not fabricate quotations or use quote styling for ordinary exposition.

## Figure

All article-owned images belong under `content/articles/<slug>/images/`.

```mdx
<Figure
  src="./images/side-effect-boundary.png"
  alt="A data flow with one branch writing to hidden mutable state."
  caption="The output stays stable while hidden state accumulates."
  width={1536}
  height={1024}
/>
```

- Describe the image's meaningful content in `alt`.
- Use `caption` for context, scope, or a concise interpretation.
- Use the real pixel dimensions.
- Do not repeat the surrounding paragraph in the caption.

## Emphasis

Markdown emphasis renders with the portfolio's emphasized text treatment:

```md
_The side effect has not disappeared. It is simply unobserved._
```

Limit emphasis to pivotal claims and turning points. Avoid emphasizing entire
paragraphs or several consecutive sentences.

## Frontmatter Example

```yaml
---
title: Is an Invisible Side Effect Harmless?
description: Exploring hidden side effects and practical ways to keep unavoidable effects predictable.
slug: side-effect
date: 2025-02-26
draft: false
kind: technical-article
topics:
  - functional-programming
spotlightIn: {}
related: ["type-safe-pipe"]
thumbnail: "./images/thumbnail-editorial.png"
---
```
