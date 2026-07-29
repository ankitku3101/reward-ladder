"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import { Celebration } from "./celebration";
import { EYFI_TIERS, type RewardTier } from "./tiers";
import "./reward-ladder.css";

export interface RewardLadderProps {
  /** The stages. Defaults to the EYFI Wave 01 ladder. */
  tiers?: RewardTier[];
  /**
   * How much scroll each stage gets, in vh. Lower = the ladder advances
   * faster under the same wheel travel.
   */
  stageScrollVh?: number;
  /**
   * `"scroll"` pins the section and scrubs through stages. `"static"`
   * renders every stage stacked, for docs, email, print — and it's what
   * reduced-motion users get automatically.
   */
  variant?: "scroll" | "static";
  /** Fire the Lottie burst when the crowning stage lands. Lazy-loaded. */
  celebrateAtMax?: boolean;
  /** Replacement Lottie JSON for the celebration. */
  celebrationData?: unknown;
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SWAP = { duration: 0.46, ease: EASE_OUT } as const;

/** The stage and peek cards swap on the same choreography — enter from
 *  below, leave upward. The peek trails the stage by a beat. */
const swapMotion = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { ...SWAP, delay },
});

const stageIndexLabel = (index: number, total: number) =>
  `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

const toneOf = (tier: RewardTier) => (tier.crowning ? "gold" : "lime");

const DEFAULT_TITLE = (
  <>
    Earned, <em>not handed.</em>
  </>
);

/** Portion of each stage's scroll segment spent holding on the threshold
 *  before the count starts climbing again. Gives the eye time to land. */
const DWELL = 0.34;

/** Where the last stage lands, as a fraction of the pinned scroll. The
 *  remaining tail is dwell on the crowning stage — without it the payoff
 *  (and the confetti) would arrive on the exact frame the pin releases. */
const CREST = 0.86;

export function RewardLadder({
  tiers = EYFI_TIERS,
  stageScrollVh = 78,
  variant = "scroll",
  celebrateAtMax = false,
  celebrationData,
  title = DEFAULT_TITLE,
  subtitle = "Scroll. Every stage is one you climbed to.",
  className,
}: RewardLadderProps) {
  const stages = useMemo(
    () => [...tiers].sort((a, b) => a.threshold - b.threshold),
    [tiers],
  );
  const max = stages[stages.length - 1]?.threshold ?? 0;
  const count = stages.length;

  const headingId = useId();
  const outerRef = useRef<HTMLDivElement | null>(null);

  /* Reduced motion is detected after mount so SSR and first paint agree —
   * branching on it during render would desync hydration. */
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const isScroll = variant === "scroll" && !prefersReduced;

  /* ── scroll → registrations ──────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  /* Each stage owns an equal slice of the scroll. Inside its slice the
   * count holds on the threshold for a beat, then climbs to the next one.
   * That's what makes the number feel like it's being earned rather than
   * linearly interpolated. */
  const [inputRange, outputRange] = useMemo(() => {
    const input: number[] = [];
    const output: number[] = [];
    const slice = CREST / Math.max(count - 1, 1);
    for (let i = 0; i < count; i += 1) {
      const start = i * slice;
      input.push(start);
      output.push(stages[i].threshold);
      if (i < count - 1) {
        input.push(start + slice * DWELL);
        output.push(stages[i].threshold);
      }
    }
    // Hold on the crowning stage for the remaining tail of the scroll.
    input.push(1);
    output.push(stages[count - 1]?.threshold ?? 0);
    return [input, output];
  }, [count, stages]);

  const registrations = useTransform(scrollYProgress, inputRange, outputRange);
  const rolled = useTransform(registrations, (v) =>
    Math.round(v).toLocaleString("en-IN"),
  );
  const railScale = useTransform(registrations, [0, max || 1], [0, 1]);

  /* activeIndex only changes at thresholds, so this setState fires a
   * handful of times per scroll-through — not once per frame. */
  const activeMotion = useTransform(registrations, (v) => {
    let index = 0;
    for (let i = 0; i < stages.length; i += 1) {
      if (v >= stages[i].threshold - 0.5) index = i;
    }
    return index;
  });

  const [active, setActive] = useState(0);
  useMotionValueEvent(activeMotion, "change", (v) => setActive(v));

  /* In static mode the scroll wiring is inert — pin the display at the top
   * stage so the section still reads as complete. */
  const activeIndex = isScroll ? active : 0;
  const activeTier = stages[activeIndex];
  const nextTier = stages[activeIndex + 1] ?? null;

  const [announcement, setAnnouncement] = useState("");
  const announced = useRef<string | null>(null);
  useEffect(() => {
    if (!isScroll || !activeTier || announced.current === activeTier.id) return;
    announced.current = activeTier.id;
    setAnnouncement(
      `${activeTier.label}, ${activeTier.threshold} registrations. ${activeTier.rewards.join(", ")}.`,
    );
  }, [activeTier, isScroll]);

  const showCelebration =
    celebrateAtMax && isScroll && activeTier?.crowning === true;

  /* ── static variant ──────────────────────────────────────── */
  if (!isScroll) {
    return (
      <section
        className={["rl", "rl--static", className].filter(Boolean).join(" ")}
        aria-labelledby={headingId}
      >
        <Header id={headingId} title={title} subtitle={subtitle} />
        <ol className="rl-static-list">
          {stages.map((tier, i) => (
            <li key={tier.id} className="rl-static-item" data-tone={toneOf(tier)}>
              <div className="rl-static-item__mark">
                <span className="rl-static-item__num">{tier.threshold}</span>
                <span className="rl-static-item__unit">
                  {tier.threshold === 0 ? "from day one" : "registrations"}
                </span>
              </div>
              <div className="rl-static-item__body">
                <p className="rl-stage__index">{stageIndexLabel(i, count)}</p>
                <h3 className="rl-stage__label">{tier.label}</h3>
                <RewardList rewards={tier.rewards} />
                {tier.note ? <p className="rl-stage__note">{tier.note}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  /* ── scroll variant ──────────────────────────────────────── */
  return (
    <section
      className={["rl", className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <div
        ref={outerRef}
        className="rl-scroll"
        style={
          {
            "--rl-track": `${Math.max(count - 1, 1) * stageScrollVh}vh`,
          } as CSSProperties
        }
      >
        <div className="rl-pin">
          {/* Full-bleed rather than boxed into the card — the source file
           * is a pair of cannons firing across the frame. */}
          {showCelebration ? (
            <Celebration animationData={celebrationData} />
          ) : null}

          <div className="rl-pin__inner">
            <Header id={headingId} title={title} subtitle={subtitle} />

            <div className="rl-stack" aria-hidden="true">
              {/* the metric, as the hero object */}
              <div className="rl-count" data-tone={toneOf(activeTier)}>
                <motion.span className="rl-count__num">{rolled}</motion.span>
                <span className="rl-count__unit">registrations</span>
              </div>

              <div className="rl-stages">
                <div className="rl-stage-slot">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.article
                      key={activeTier.id}
                      className="rl-stage"
                      data-tone={toneOf(activeTier)}
                      {...swapMotion()}
                    >
                      <p className="rl-stage__index">
                        {stageIndexLabel(activeIndex, count)}
                      </p>
                      <h3 className="rl-stage__label">{activeTier.label}</h3>
                      {activeTier.blurb ? (
                        <p className="rl-stage__blurb">{activeTier.blurb}</p>
                      ) : null}
                      <RewardList rewards={activeTier.rewards} stagger />
                      {activeTier.note ? (
                        <p className="rl-stage__note">{activeTier.note}</p>
                      ) : null}
                    </motion.article>
                  </AnimatePresence>
                </div>

                {/* the next rung, dimmed — this is the pull */}
                <div className="rl-peek-slot">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={nextTier?.id ?? "__crest"}
                      className={
                        nextTier ? "rl-peek" : "rl-peek rl-peek--done"
                      }
                      {...swapMotion(0.06)}
                    >
                      {nextTier ? (
                        <>
                          <span className="rl-peek__tag">
                            Next · {nextTier.threshold}
                          </span>
                          <span className="rl-peek__label">
                            {nextTier.label}
                          </span>
                        </>
                      ) : (
                        <span className="rl-peek__label">
                          Top of the ladder.
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* the rail advances itself — nothing to drag */}
            <div className="rl-rail" aria-hidden="true">
              <div className="rl-rail__track">
                <motion.div
                  className="rl-rail__fill"
                  style={{ scaleX: railScale }}
                />
                {stages.map((tier, i) => (
                  <span
                    key={tier.id}
                    className="rl-rail__tick"
                    data-reached={i <= activeIndex}
                    data-crowning={tier.crowning ? "true" : undefined}
                    style={
                      {
                        "--rl-at": `${(tier.threshold / (max || 1)) * 100}%`,
                      } as CSSProperties
                    }
                  >
                    <span className="rl-rail__dot" />
                    <span className="rl-rail__label">{tier.threshold}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The visual layer above is aria-hidden — it only ever shows one
       * stage. This is the complete ladder, always, for screen readers. */}
      <ol className="rl-sr">
        {stages.map((tier) => (
          <li key={tier.id}>
            {tier.label} — {tier.threshold} registrations.{" "}
            {tier.rewards.join(", ")}.
          </li>
        ))}
      </ol>

      <p className="rl-sr" role="status" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}

function Header({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <header className="rl-head">
      <h2 id={id} className="rl-head__title">
        {title}
      </h2>
      {subtitle ? <p className="rl-head__sub">{subtitle}</p> : null}
    </header>
  );
}

function RewardList({
  rewards,
  stagger = false,
}: {
  rewards: string[];
  stagger?: boolean;
}) {
  return (
    <ul className="rl-stage__rewards">
      {rewards.map((reward, i) => (
        <motion.li
          key={reward}
          className="rl-stage__reward"
          initial={stagger ? { opacity: 0, y: 10 } : false}
          animate={stagger ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 0.34,
            ease: EASE_OUT,
            delay: 0.14 + i * 0.07,
          }}
        >
          <span className="rl-stage__bullet" aria-hidden="true" />
          {reward}
        </motion.li>
      ))}
    </ul>
  );
}

export default RewardLadder;
