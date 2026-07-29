# Reward Ladder

The EYFI Campus Ambassador milestone ladder as a **scroll-scrubbed
sequence**. The section pins, the registration count rolls as you scroll,
one stage is active at a time with the next one dimmed beneath it, and the
rail advances itself. There is no drag control — scroll *is* the
interaction.

## Install

```bash
npx shadcn@latest add https://<your-host>/r/reward-ladder.json
```

Installs the component files, adds `motion` + `lottie-react`, and injects
the EYFI CSS variables. Run `npm run registry:build` in this repo first to
emit `public/r/reward-ladder.json`.

## Use

```tsx
import { RewardLadder } from "@/components/reward-ladder";

<RewardLadder celebrateAtMax />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tiers` | `RewardTier[]` | `EYFI_TIERS` | Sorted by threshold internally. |
| `stageScrollVh` | `number` | `78` | Scroll travel per stage, in vh. Lower advances faster. |
| `variant` | `"scroll" \| "static"` | `"scroll"` | `static` drops the pin and stacks every stage. |
| `celebrateAtMax` | `boolean` | `false` | Confetti when the crowning stage lands. |
| `celebrationData` | `unknown` | bundled `confetti.json` | Your own Lottie JSON. |
| `title` / `subtitle` | `ReactNode` | EYFI copy | Pass `null` to drop. |

Total section height is `(tiers.length - 1) × stageScrollVh + 100svh`.
Six stages at the default is `390vh + 100svh`.

## How the scroll works

A tall wrapper with a `position: sticky` child is the pin — no scroll
library, no ScrollTrigger. `useScroll` reads progress across exactly that
range and everything else derives from it:

- **the count** — each stage owns an equal slice of the scroll. Inside its
  slice the number *holds* on the threshold for the first third, then
  climbs to the next one. That dwell is what makes it read as earned
  rather than linearly interpolated.
- **the active stage** — derived as a `MotionValue`, so the React setState
  fires a handful of times per scroll-through, not once per frame.
- **the rail** — `scaleX` only. No layout properties are animated anywhere.

## Fixed transition boxes

The active card and the peek card are a **fixed height at every
breakpoint** (`--rl-stage-h` / `--rl-peek-h` on `.rl-stack`), sized to the
tallest stage. A one-reward stage and a three-reward stage occupy the
identical box, so nothing below them shifts during a swap. Override on
`.rl-stack` if your copy runs longer:

```css
.rl-stack {
  --rl-stage-h: 24rem;
  --rl-peek-h: 3.5rem;
}
```

## Framework portability

No `next/*` imports anywhere. The component reads `var(--font-display)`,
`var(--font-sans)` and `var(--font-serif-italic)` with fallback stacks, so
it renders the same in the TanStack Start ambassador app as it does here —
load the three faces however that app already loads fonts.

Every colour resolves through `var(--token, fallback)`. A host project that
already defines the shadcn semantic tokens (`--background`, `--primary`,
`--muted-foreground`, `--border`…) wins automatically; a bare project falls
back to the EYFI values baked into `reward-ladder.css`.

## Theming

```css
--primary   /* lime — the active stage, the rail, the count */
--gold      /* the crowning stage (any tier with `crowning: true`) */
--background --card --border --border-strong
--foreground --muted-foreground --muted-foreground-2 --muted-foreground-3
```

## Celebration

`confetti.json` (71 KB) and `lottie-react` both sit behind a dynamic
`import()` — **0 KB until someone actually scrolls to the top stage**. It
renders full-bleed across the pinned viewport with
`preserveAspectRatio: "xMidYMid slice"`, because the source file is
portrait (609×812) and would otherwise letterbox into the middle.

Swap it with `celebrationData={yourLottieJson}`. Never loads under
`prefers-reduced-motion: reduce`.

## Accessibility

- The visual layer is `aria-hidden` — it only ever shows one stage. A
  complete, always-present `<ol>` of every tier and its rewards sits
  alongside it for screen readers.
- Stage changes announce through a polite live region.
- `prefers-reduced-motion: reduce` switches to the static variant: no pin,
  no scrubbing, every stage stacked and readable. Detected after mount so
  SSR and hydration agree.

## The preview harness

`app/preview/` renders every stage at once plus a long-copy overflow case.
Open it, confirm, then delete the route — it isn't part of the component.
