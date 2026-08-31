# Leaderboard

The EYFI Campus Ambassador leaderboard: an asymmetric podium for the top 3,
a "your rank" callout, and a scannable ranked list below — with a toggle
between **Top Earners** (individuals) and **Top Campuses** (campus rivalry).

## Install

```bash
npx shadcn@latest add https://<your-host>/r/leaderboard.json
```

Installs the component files and adds `motion`. Run `npm run registry:build`
in this repo first to emit `public/r/leaderboard.json`.

## Use

```tsx
import { Leaderboard } from "@/components/leaderboard";

<Leaderboard />;
```

Pass your own data via `views` — see `entries.ts` for the shape. Exactly one
entry per view should have `isSelf: true`; that's what drives the "you"
callout and its "₹X more puts you past Y" line.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `views` | `LeaderboardView[]` | `EYFI_LEADERBOARD_VIEWS` | Each view's `entries` must already be sorted by `rank`. |
| `defaultViewId` | `string` | first view's `id` | Which toggle option starts active. |
| `title` / `subtitle` | `ReactNode` | EYFI copy | Pass `null` to drop. |

## Data shape

```ts
interface LeaderboardEntry {
  id: string;
  rank: number;
  previousRank?: number; // omit → renders "NEW"
  name: string;
  detail: string;        // campus (earners view) or member count (campuses view)
  income: number;        // ₹
  isSelf?: boolean;      // exactly one per view
  streak?: boolean;      // shows a flame tag
}
```

Rank deltas (▲ / ▼ / — / NEW) are derived from `rank` vs `previousRank` —
don't pass a delta directly.

## Why no scroll-scrub

Unlike the reward ladder, every rank here is visible at once — hiding all
but one behind a scroll-pinned viewport would make the list unreadable to
anyone not actively scrolling, and (unlike the ladder's single climbing
number) there's nothing here that's meaningfully "one stage at a time."
So the podium and list are plain, always-visible `<ol>`s; the only motion is
a one-shot entrance stagger, a count-up on the podium numbers, and a
fade/slide when the toggle switches views.

## Accessibility

- Podium and list are real `<ol>`s with real text content — nothing is
  hidden from screen readers to fake a "single active state" the way the
  ladder does, because here everything actually is visible at once.
- Delta chips carry a full `aria-label` ("Up 2 ranks since last update",
  "New entry", …) instead of relying on the bare arrow + number.
- A polite live region announces the leader and the viewer's own rank
  whenever the view toggle changes.
- `prefers-reduced-motion: reduce` skips the entrance stagger, the podium's
  count-up (numbers land on their final value immediately), and the
  toggle's fade/slide swap.

## Theming

```css
--primary   /* lime — #2/#3 podium tint, up-chips, the "you" callout, rank text */
--gold      /* #1 podium tint, the crown, streak tags */
--background --card --border --border-strong
--foreground --muted-foreground --muted-foreground-2 --muted-foreground-3
```

No new hues beyond what `reward-ladder` already uses — a rank moving down
stays a quiet grey chip rather than introducing red, so the palette holds
at two accents.

## The preview harness

`app/preview/` renders the leaderboard in its states (both views, long
names, reduced motion). Open it, confirm, then delete the route — it isn't
part of the shipped component.
