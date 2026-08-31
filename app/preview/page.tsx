import Link from "next/link";

import { EYFI_LEADERBOARD_VIEWS, Leaderboard } from "@/components/leaderboard";
import { EYFI_TIERS, RewardLadder } from "@/components/reward-ladder";
import "./preview.css";

/**
 * Throwaway harness. Open it once, confirm every stage renders at every
 * width, then delete the route. Not part of the shipped component.
 */
export default function Preview() {
  return (
    <main className="flex-1 mx-auto w-full max-w-4xl px-5 py-10 sm:px-6">
      <h1 className="font-display text-2xl">Reward Ladder — state preview</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The scroll variant can only be judged by scrolling — see{" "}
        <Link href="/" className="text-primary underline">
          the demo page
        </Link>
        . What&apos;s below is every stage rendered at once, which is what
        reduced-motion users and the <code className="text-primary">static</code>{" "}
        variant get.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-lg">Static variant — all stages</h2>
        <RewardLadder variant="static" title="All stages" subtitle={null} />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-lg">Single stage · lime vs gold</h2>
        <div className="preview-split mt-4">
          <RewardLadder
            variant="static"
            title={null}
            subtitle={null}
            tiers={[EYFI_TIERS[1]]}
          />
          <RewardLadder
            variant="static"
            title={null}
            subtitle={null}
            tiers={[EYFI_TIERS[EYFI_TIERS.length - 1]]}
          />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-lg">Copy overflow — long labels</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Confirms nothing breaks the layout when the founder writes longer
          copy than the defaults.
        </p>
        <RewardLadder
          variant="static"
          title={null}
          subtitle={null}
          tiers={[
            {
              id: "overflow",
              threshold: 1500,
              label:
                "An extremely long milestone label that has to wrap without pushing anything sideways",
              blurb: "Blurb copy that also runs considerably longer than usual.",
              rewards: [
                "A reward line long enough to wrap onto several lines on a narrow screen without breaking the bullet alignment",
                "Short one",
              ],
              note: "And a closing note in the italic serif.",
            },
          ]}
        />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-lg">Leaderboard — default, both views</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          The toggle switches between Top Earners and Top Campuses. Try it,
          then check with reduced motion enabled — the entrance stagger and
          count-up should both disappear.
        </p>
        <Leaderboard />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-lg">Leaderboard — single view (toggle hidden)</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Passing one view drops the toggle entirely rather than rendering a
          single disabled option.
        </p>
        <Leaderboard
          views={[EYFI_LEADERBOARD_VIEWS[0]]}
          title="Only one view"
          subtitle={null}
        />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-lg">Leaderboard — overflow copy</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Confirms long names and campus strings wrap or truncate without
          breaking the podium or row grid.
        </p>
        <Leaderboard
          title="Copy overflow"
          subtitle={null}
          views={[
            {
              id: "overflow",
              label: "Overflow",
              entries: [
                {
                  id: "o-1",
                  rank: 1,
                  previousRank: 1,
                  name: "Venkataramanan Subramaniam Iyer",
                  detail: "Sri Venkateswara College of Engineering and Technology",
                  income: 219400,
                },
                {
                  id: "o-2",
                  rank: 2,
                  previousRank: 2,
                  name: "Priya S.",
                  detail: "BITS Pilani",
                  income: 152900,
                },
                {
                  id: "o-3",
                  rank: 3,
                  name: "Riya K.",
                  detail: "NIT Trichy",
                  income: 131000,
                },
                {
                  id: "o-you",
                  rank: 4,
                  previousRank: 9,
                  name: "You",
                  detail: "An Extremely Long Campus Name That Should Ellipsis Cleanly",
                  income: 98000,
                  isSelf: true,
                  streak: true,
                },
              ],
            },
          ]}
        />
      </section>
    </main>
  );
}
