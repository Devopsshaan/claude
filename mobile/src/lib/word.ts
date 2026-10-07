import { DAILY_VERSES } from "@/content/verses";
import { WORD_REFLECTIONS } from "@/content/word-reflections";
import type { DailyVerse } from "@/content/types";

/**
 * "Your Word for Today": the same rule as oneprayer.church (src/lib/word/daily.ts).
 * One global verse per UTC calendar day, so the app and the website always show the
 * same Word, and it changes by itself every day with no server call.
 */
export type DailyWord = { date: string; verse: DailyVerse; reflection: string; prayer: string };

export function utcDayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86_400_000);
}

export function wordForDate(d: Date = new Date()): DailyWord {
  const verse = DAILY_VERSES[utcDayNumber(d) % DAILY_VERSES.length];
  const r = WORD_REFLECTIONS[verse.ref];
  if (!r) throw new Error(`Missing reflection for ${verse.ref}`);
  return { date: d.toISOString().slice(0, 10), verse, reflection: r.reflection, prayer: r.prayer };
}

export const DOOR_VERSE = {
  text: "Behold, I stand at the door and knock. If anyone hears my voice and opens the door, then I will come in to him and will dine with him, and he with me.",
  ref: "Revelation 3:20",
  translation: "WEB",
};
