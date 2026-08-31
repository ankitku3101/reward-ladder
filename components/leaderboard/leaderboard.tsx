"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  EYFI_LEADERBOARD_VIEWS,
  type LeaderboardEntry,
  type LeaderboardView,
} from "./entries";
import "./leaderboard.css";

export interface LeaderboardProps {
  /** The views the toggle switches between. Defaults to earners + campuses. */
  views?: LeaderboardView[];
  /** Which view's `id` starts active. Defaults to the first view. */
  defaultViewId?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const DEFAULT_TITLE = (
  <>
    Ranked by ₹ earned. <em>Nothing else counts.</em>
  </>
);

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type Delta =
  | { dir: "up"; value: number }
  | { dir: "down"; value: number }
  | { dir: "flat" }
  | { dir: "new" };

function deltaOf(entry: LeaderboardEntry): Delta {
  if (entry.previousRank == null) return { dir: "new" };
  const diff = entry.previousRank - entry.rank;
  if (diff > 0) return { dir: "up", value: diff };
  if (diff < 0) return { dir: "down", value: -diff };
  return { dir: "flat" };
}

function deltaLabel(delta: Delta) {
  if (delta.dir === "new") return "New entry";
  if (delta.dir === "flat") return "No change since last update";
  const word = delta.dir === "up" ? "Up" : "Down";
  return `${word} ${delta.value} rank${delta.value === 1 ? "" : "s"} since last update`;
}

function DeltaChip({ entry }: { entry: LeaderboardEntry }) {
  const delta = deltaOf(entry);
  if (delta.dir === "new") {
    return (
      <span className="lb-chip" data-dir="new" aria-label={deltaLabel(delta)}>
        NEW
      </span>
    );
  }
  if (delta.dir === "flat") {
    return (
      <span className="lb-chip" data-dir="flat" aria-label={deltaLabel(delta)}>
        —
      </span>
    );
  }
  return (
    <span className="lb-chip" data-dir={delta.dir} aria-label={deltaLabel(delta)}>
      {delta.dir === "up" ? "▲" : "▼"} {delta.value}
    </span>
  );
}

/** A drawn bust standing in for a photo — there's no real headshot for a
 *  mock roster, and an illustrated mark reads more finished than initials
 *  while staying honest about being a placeholder. */
function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8.2" r="4" />
      <path d="M3.5 21c0-4.97 3.8-8 8.5-8s8.5 3.03 8.5 8v.5h-17V21z" />
    </svg>
  );
}

/** Counts up to `value` on mount. Jumps straight there under reduced motion. */
function useCountUp(value: number, reduced: boolean) {
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = reduced ? 0 : 900;
    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);

  return display;
}

function PodiumTile({
  entry,
  index,
  reduced,
}: {
  entry: LeaderboardEntry;
  index: number;
  reduced: boolean;
}) {
  const amount = useCountUp(entry.income, reduced);
  const tone = entry.rank === 1 ? "gold" : "lime";

  return (
    <li className="lb-podium__tile" data-rank={entry.rank} data-tone={tone}>
      <motion.div
        className="lb-podium__inner"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: EASE_OUT, delay: index * 0.09 }}
      >
        {entry.rank === 1 ? (
          <span className="lb-podium__crown" aria-hidden="true">
            👑
          </span>
        ) : null}
        <p className="lb-podium__rank">Rank {entry.rank}</p>
        <span className="lb-podium__avatar">
          <PersonIcon />
        </span>
        <h3 className="lb-podium__name">{entry.name}</h3>
        <p className="lb-podium__detail">{entry.detail}</p>
        <p className="lb-podium__amount">{money(amount)}</p>
        <span className="lb-podium__delta">
          <DeltaChip entry={entry} />
        </span>
      </motion.div>
    </li>
  );
}

function Row({
  entry,
  index,
  reduced,
}: {
  entry: LeaderboardEntry;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.li
      className="lb-row"
      data-self={entry.isSelf ? "true" : "false"}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.26 + index * 0.045 }}
    >
      <span className="lb-row__rank">{entry.rank}</span>
      <span className="lb-row__who">
        <span className="lb-row__avatar">
          <PersonIcon />
        </span>
        <span className="lb-row__names">
          <span className="lb-row__name">
            {entry.name}
            {entry.streak ? (
              <span className="lb-row__streak">🔥 3-day streak</span>
            ) : null}
          </span>
          <span className="lb-row__detail">{entry.detail}</span>
        </span>
      </span>
      <DeltaChip entry={entry} />
      <span className="lb-row__amount">{money(entry.income)}</span>
    </motion.li>
  );
}

function YouCallout({ view }: { view: LeaderboardView }) {
  const selfIndex = view.entries.findIndex((e) => e.isSelf);
  if (selfIndex === -1) return null;

  const self = view.entries[selfIndex];
  const above = view.entries[selfIndex - 1] ?? null;
  const gap = above ? above.income - self.income : 0;

  return (
    <div className="lb-you">
      <div className="lb-you__left">
        <span className="lb-you__badge">#{self.rank}</span>
        <span className="lb-you__text">
          <p className="lb-you__label">Your rank</p>
          <p className="lb-you__note">
            {above
              ? `${money(gap)} more puts you past ${above.name}.`
              : "Nobody's ahead of you. Hold the line."}
          </p>
        </span>
      </div>
      <span className="lb-you__amount">{money(self.income)}</span>
    </div>
  );
}

export function Leaderboard({
  views = EYFI_LEADERBOARD_VIEWS,
  defaultViewId,
  title = DEFAULT_TITLE,
  subtitle = "Every rupee you bring in moves you up. Every campus is watching the one next to it.",
  className,
}: LeaderboardProps) {
  const headingId = useId();
  const [viewId, setViewId] = useState(defaultViewId ?? views[0]?.id);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const view = useMemo(
    () => views.find((v) => v.id === viewId) ?? views[0],
    [views, viewId],
  );

  const announcement = useMemo(() => {
    if (!view) return "";
    const leader = view.entries[0];
    const self = view.entries.find((e) => e.isSelf);
    return (
      `Showing ${view.label}.` +
      (leader ? ` ${leader.name} leads with ${money(leader.income)}.` : "") +
      (self ? ` You are rank ${self.rank} with ${money(self.income)}.` : "")
    );
  }, [view]);

  if (!view) return null;

  const podium = view.entries.slice(0, 3);
  const rows = view.entries.slice(3);

  return (
    <section
      className={["lb", className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <span className="lb-eyebrow">Wave 01 · Leaderboard</span>

      <div className="lb-head">
        <div>
          <h2 id={headingId} className="lb-head__title">
            {title}
          </h2>
          {subtitle ? <p className="lb-head__sub">{subtitle}</p> : null}
        </div>

        {views.length > 1 ? (
          <div
            className="lb-toggle"
            data-active-index={views.findIndex((v) => v.id === viewId)}
            role="group"
            aria-label="Leaderboard view"
          >
            <span
              className="lb-toggle__thumb"
              aria-hidden="true"
              style={{
                width: `calc(${100 / views.length}% - 0.25rem)`,
                transform: `translateX(${views.findIndex((v) => v.id === viewId) * 100}%)`,
              }}
            />
            {views.map((v) => (
              <button
                key={v.id}
                type="button"
                className="lb-toggle__btn"
                aria-pressed={v.id === viewId}
                onClick={() => setViewId(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view.id}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
        >
          <ol className="lb-podium">
            {podium.map((entry, i) => (
              <PodiumTile key={entry.id} entry={entry} index={i} reduced={reduced} />
            ))}
          </ol>

          <YouCallout view={view} />

          <ol className="lb-list" start={4}>
            {rows.map((entry, i) => (
              <Row key={entry.id} entry={entry} index={i} reduced={reduced} />
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>

      <p className="lb-sr" role="status" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}

export default Leaderboard;
