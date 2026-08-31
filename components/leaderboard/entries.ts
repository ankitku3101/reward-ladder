export interface LeaderboardEntry {
  /** Stable key. Used for animation identity — don't reuse across entries. */
  id: string;
  /** Current position. The array itself should already be sorted by this. */
  rank: number;
  /** Omit for a first-time top-10 entry — renders as "NEW" instead of a delta. */
  previousRank?: number;
  name: string;
  /** Earners view: the ambassador's campus. Campuses view: a member-count line. */
  detail: string;
  /** ₹ earned in the challenge window. */
  income: number;
  /** Highlights this row and drives the "you" callout under the podium. */
  isSelf?: boolean;
  /** Shows a small flame tag next to the name. */
  streak?: boolean;
}

export interface LeaderboardView {
  /** Stable key, also the toggle button's value. */
  id: string;
  /** Toggle label, e.g. "Top Earners". */
  label: string;
  /** Sorted by `rank` ascending. Must include exactly one `isSelf` entry. */
  entries: LeaderboardEntry[];
}

/**
 * EYFI Campus Ambassador — Wave 01 leaderboard.
 *
 * Two views on the same shape: individual ambassadors ranked by income, and
 * campuses ranked by their ambassadors' combined income. Swap this array (or
 * pass your own via the `views` prop) without touching the component.
 */
export const EYFI_LEADERBOARD_VIEWS: LeaderboardView[] = [
  {
    id: "earners",
    label: "Top Earners",
    entries: [
      { id: "e-1", rank: 1, previousRank: 1, name: "Arjun M.", detail: "IIT Bombay", income: 184200 },
      { id: "e-2", rank: 2, previousRank: 3, name: "Priya S.", detail: "BITS Pilani", income: 152900 },
      { id: "e-3", rank: 3, previousRank: 2, name: "Riya K.", detail: "NIT Trichy", income: 131000 },
      { id: "e-4", rank: 4, previousRank: 6, name: "Karthik R.", detail: "Manipal Institute of Tech", income: 98500 },
      { id: "e-5", rank: 5, previousRank: 5, name: "Ananya D.", detail: "SRM Chennai", income: 91200, streak: true },
      { id: "e-6", rank: 6, previousRank: 4, name: "Meera J.", detail: "Christ University", income: 84300 },
      { id: "e-7", rank: 7, name: "Rohan P.", detail: "Delhi University", income: 76900 },
      { id: "e-8", rank: 8, previousRank: 12, name: "Simran K.", detail: "IIT Bombay", income: 68100 },
      { id: "e-9", rank: 9, previousRank: 7, name: "Yash T.", detail: "VJTI Mumbai", income: 11000 },
      { id: "e-10", rank: 10, previousRank: 10, name: "Neha V.", detail: "BITS Pilani", income: 10200 },
      { id: "e-11", rank: 11, previousRank: 12, name: "Dev A.", detail: "NIT Trichy", income: 9950, streak: true },
      { id: "e-12", rank: 12, previousRank: 12, name: "Ira B.", detail: "Manipal Institute of Tech", income: 9700 },
      { id: "e-13", rank: 13, previousRank: 12, name: "Farhan Q.", detail: "SRM Chennai", income: 9550 },
      { id: "e-you", rank: 14, previousRank: 12, name: "You", detail: "VJTI Mumbai", income: 9400, isSelf: true },
    ],
  },
  {
    id: "campuses",
    label: "Top Campuses",
    entries: [
      { id: "c-1", rank: 1, previousRank: 1, name: "IIT Bombay", detail: "24 ambassadors", income: 812400 },
      { id: "c-2", rank: 2, previousRank: 2, name: "BITS Pilani", detail: "21 ambassadors", income: 704900 },
      { id: "c-3", rank: 3, previousRank: 3, name: "NIT Trichy", detail: "19 ambassadors", income: 588000 },
      { id: "c-4", rank: 4, previousRank: 5, name: "Christ University", detail: "17 ambassadors", income: 363800 },
      { id: "c-you", rank: 5, previousRank: 6, name: "VJTI Mumbai", detail: "18 ambassadors", income: 341800, isSelf: true },
      { id: "c-6", rank: 6, previousRank: 6, name: "SRM Chennai", detail: "20 ambassadors", income: 298600 },
      { id: "c-7", rank: 7, name: "Delhi University", detail: "15 ambassadors", income: 244100 },
      { id: "c-8", rank: 8, previousRank: 7, name: "Manipal Institute of Tech", detail: "16 ambassadors", income: 231900 },
    ],
  },
];
