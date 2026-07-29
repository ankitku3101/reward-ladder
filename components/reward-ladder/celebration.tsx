"use client";

import { Suspense, lazy } from "react";

/**
 * The Founding Team celebration.
 *
 * Both `lottie-react` and the 71 KB animation sit behind a dynamic import,
 * so nothing here is downloaded until someone actually scrolls to the top
 * stage. Pass your own `animationData` to swap the file out.
 */
const LottieConfetti = lazy(async () => {
  const [lottie, confetti] = await Promise.all([
    import("lottie-react"),
    import("./confetti.json"),
  ]);
  const Lottie = lottie.default;
  const fallbackData = confetti.default;

  return {
    default: function Burst({ animationData }: { animationData?: unknown }) {
      return (
        <Lottie
          animationData={animationData ?? fallbackData}
          loop={false}
          autoplay
          // The source file is portrait (609×812); `slice` lets it cover a
          // landscape viewport instead of letterboxing into the middle.
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
          aria-hidden="true"
        />
      );
    },
  };
});

export interface CelebrationProps {
  /** Optional replacement Lottie JSON. */
  animationData?: unknown;
}

export function Celebration({ animationData }: CelebrationProps) {
  return (
    <div className="rl-celebration" aria-hidden="true">
      <Suspense fallback={null}>
        <LottieConfetti animationData={animationData} />
      </Suspense>
    </div>
  );
}
