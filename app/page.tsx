import { Leaderboard } from "@/components/leaderboard";
import { RewardLadder } from "@/components/reward-ladder";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 py-5">
          <span className="inline-flex h-6 items-center rounded-full bg-primary px-2.5 text-[11px] font-bold tracking-[0.08em] text-primary-foreground uppercase">
            Wave 01
          </span>
          <span className="text-sm text-muted-foreground-2">
            EYFI Campus Ambassadors · Reward Ladder
          </span>
        </div>

        {/* Lead-in, so you can see the section pin as it enters. */}
        <div className="flex min-h-[70svh] flex-col justify-center py-16">
          <p className="text-[11px] tracking-[0.12em] text-muted-foreground-3 uppercase">
            Wave 01 · Campus Ambassadors
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.08] sm:text-6xl">
            Someone is going to build EYFI on your campus.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Keep scrolling. Every rung below is one you climbed to.
          </p>
        </div>

        <RewardLadder celebrateAtMax />

        <div className="py-16 sm:py-24">
          <Leaderboard />
        </div>
      </div>
    </main>
  );
}
