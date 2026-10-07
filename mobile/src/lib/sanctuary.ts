/**
 * Sanctuary: a chapel that is built, one prayer at a time.
 *
 * Every day the user prays, the chapel gains a piece. The count that builds it is
 * total days prayed (it is never torn down); the current streak only controls how
 * brightly it glows, so missing a day dims the light but never destroys the work.
 */
export type Milestone = { day: number; piece: string; title: string; detail: string };

export const MILESTONES: Milestone[] = [
  { day: 1, piece: "foundation", title: "The first stone", detail: "Every sanctuary begins with one stone laid in faith." },
  { day: 3, piece: "door", title: "A door", detail: "“Knock, and it will be opened to you.”" },
  { day: 5, piece: "window", title: "A window", detail: "Light has a way in now." },
  { day: 7, piece: "glass", title: "Stained glass", detail: "One week of prayer, and the window fills with colour." },
  { day: 10, piece: "roof", title: "The roof", detail: "Shelter. Your chapel can hold a storm." },
  { day: 14, piece: "window2", title: "A second window", detail: "Two weeks. The light inside is doubling." },
  { day: 21, piece: "cross", title: "The cross", detail: "Three weeks. The chapel is crowned." },
  { day: 30, piece: "bell", title: "The bell", detail: "Thirty days. Your chapel can be heard across the hill." },
  { day: 40, piece: "halo", title: "Full light", detail: "Forty days, like the wilderness. Your sanctuary is complete and shining." },
];

/** Pieces present after `days` days of prayer. */
export function piecesFor(days: number): Set<string> {
  return new Set(MILESTONES.filter((m) => days >= m.day).map((m) => m.piece));
}

/** The milestone reached exactly on this day, if any. */
export function milestoneAt(days: number): Milestone | undefined {
  return MILESTONES.find((m) => m.day === days);
}

/** The next milestone to look forward to. */
export function nextMilestone(days: number): Milestone | undefined {
  return MILESTONES.find((m) => m.day > days);
}

/** Wall height 0→1: stones rise over the first ten days, then the walls are complete. */
export function wallProgress(days: number): number {
  return Math.min(1, days / 10);
}

/** How brightly the chapel glows, from the current streak (0 = dark, 1 = full). */
export function glowFor(streak: number, days: number): number {
  if (days === 0) return 0;
  if (streak === 0) return 0.18; // the light never fully dies
  return Math.min(1, 0.45 + streak * 0.08);
}
