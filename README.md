# Hwanhee's Portfolio

A Next.js portfolio built with MDX, and a file-based content store.

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm content:compile
pnpm content:check
pnpm article:new <slug>
pnpm article:publish <slug>
pnpm article:check <slug>
```

Content and its JSON Schemas live in `content/`. Run `pnpm content:compile`
to validate sources and generate the read model in
`src/__generated__/content/`. Page composition lives in `src/app/`.
