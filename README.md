# EYFI Reward Ladder

A scroll-scrubbed milestone ladder for the [EYFI Campus Ambassador
programme](https://ambassador.eyfichallenge.com). The section pins, the
registration count rolls as you scroll, one stage is active at a time with
the next dimmed beneath it, and the rail advances itself. There is no drag
control — scroll *is* the interaction.

This repo is two things: a **demo app** (Next.js 16, App Router) and a
**shadcn registry** that ships the component to any React project.

```
app/                      demo app — Next-specific, not distributed
  tokens.css              EYFI design tokens, extracted from the live site
  globals.css             Tailwind v4 @theme mapping
  layout.tsx              next/font wiring for the three faces
  page.tsx                the demo
  preview/                dev harness — every stage at once + overflow cases
components/reward-ladder/ the distributed component — zero next/* imports
registry.json             registry source
public/r/                 built registry (generated, git-ignored)
```

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run typecheck` · `npm run lint` · `npm run build`

## Deploy to Vercel

Zero configuration — Vercel auto-detects Next.js. `npm run build` chains
`shadcn build` ahead of `next build`, so `public/r/reward-ladder.json` is
regenerated from source on every deploy and can never drift from the
component.

```bash
git init && git add -A && git commit -m "EYFI reward ladder"
# push to GitHub, then import at vercel.com/new
```

`metadataBase` reads `VERCEL_PROJECT_PRODUCTION_URL` at build time, so OG
tags resolve against the real domain with nothing to configure.

## Install the component elsewhere

Once deployed:

```bash
npx shadcn@latest add https://<your-deployment>/r/reward-ladder.json
```

That drops the component files into `components/reward-ladder/`, installs
`motion` + `lottie-react`, and injects the EYFI CSS variables.

The component has **no `next/*` imports** — it reads `var(--font-display)`,
`var(--font-sans)` and `var(--font-serif-italic)` with fallback stacks, and
every colour resolves through `var(--token, fallback)`. It drops into the
TanStack Start ambassador app unchanged; that project's existing shadcn
tokens win automatically over the baked-in EYFI defaults.

Full props, theming and accessibility notes:
[components/reward-ladder/README.md](components/reward-ladder/README.md).

## Design tokens

Extracted from the live ambassador site's page source — near-black paper,
neon-lime accent, gold for the crowning stage:

| | |
| --- | --- |
| paper | `#0A0A0A` |
| primary (lime) | `#C4F62E` |
| gold | `#E8B923` |
| ink | `#FFFFFF` → `#C8C8C4` → `#8A8A85` → `#4A4A4A` |
| display | Bricolage Grotesque 800 |
| body | Space Grotesk |
| emphasis | Instrument Serif italic |
