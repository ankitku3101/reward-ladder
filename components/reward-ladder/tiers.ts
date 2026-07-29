export interface RewardTier {
  /** Stable key. Used for animation identity — don't reuse across tiers. */
  id: string;
  /** Registrations needed to unlock. The first tier should be 0. */
  threshold: number;
  /** The title of the stage. */
  label: string;
  /** A short line of framing shown under the title on the active stage. */
  blurb?: string;
  /** What actually lands in the ambassador's hands. */
  rewards: string[];
  /** One line of voice under the rewards. Optional, use sparingly. */
  note?: string;
  /** `true` renders the stage in gold rather than lime. */
  crowning?: boolean;
}

/**
 * EYFI Campus Ambassador — Wave 01.
 *
 * Copy follows the ambassador site's voice: second person, sentence case,
 * short. Swap this array (or pass your own via the `tiers` prop) without
 * touching the component.
 */
export const EYFI_TIERS: RewardTier[] = [
  {
    id: "scout",
    threshold: 0,
    label: "Selected as Scout",
    blurb: "You're in. Before anyone on your campus has heard of it.",
    rewards: ["Private community access", "Starter kit"],
    note: "Day one. Nobody handed you this either.",
  },
  {
    id: "ambassador",
    threshold: 25,
    label: "Campus Ambassador",
    blurb: "Twenty-five people signed up because of you.",
    rewards: [
      "Official Campus Ambassador title",
      "First swag drop",
      "Prize-linked challenge",
    ],
    note: "The title you earn, not the one you're handed.",
  },
  {
    id: "grants",
    threshold: 50,
    label: "Campus Grants",
    blurb: "Now you can put something on, not just talk about it.",
    rewards: ["First event grant for your campus", "Exclusive merch"],
  },
  {
    id: "mentorship",
    threshold: 75,
    label: "Mentorship",
    blurb: "You stop being supported and start being coached.",
    rewards: ["Mentorship access", "Larger, repeatable campus grants"],
  },
  {
    id: "internship",
    threshold: 100,
    label: "Paid Internship",
    blurb: "A hundred registrations is a track record, not a favour.",
    rewards: ["Paid internship opportunities", "Invite to ambassador events"],
  },
  {
    id: "founding",
    threshold: 200,
    label: "Founding Team",
    blurb: "At this point you didn't join the movement. You built it.",
    crowning: true,
    rewards: ["Consideration for the Founding Team"],
    note: "Not a reward. An invitation.",
  },
];
