/**
 * Types for original editorial content. Seed data is written in these shapes and
 * loaded into the database by `npm run db:seed`; afterwards the admin CMS owns it.
 *
 * Scripture quotations use only public-domain translations:
 *   WEB — World English Bible (public domain)
 *   KJV — King James Version (public domain outside the UK Crown patent)
 */
export type Translation = "WEB" | "KJV";

export type DevotionalTopic =
  | "hope"
  | "strength"
  | "healing"
  | "family"
  | "work_finances"
  | "gratitude"
  | "peace"
  | "forgiveness"
  | "scripture";

export type DevotionalSeed = {
  slug: string;
  title: string;
  topic: DevotionalTopic;
  excerpt: string; // <= 180 chars
  scriptureRef: string; // e.g. "Isaiah 41:10 (WEB)"
  scriptureText: string; // exact public-domain text
  body: string; // Markdown, 450-800 words, original writing
  readingMinutes: number;
};

export type BibleResourceKind = "reading_plan" | "explanation" | "guided_prayer";

export type BibleResourceSeed = {
  slug: string;
  kind: BibleResourceKind;
  title: string;
  topic: string; // free text topic tag e.g. "anxiety", "grief", "prayer"
  summary: string; // <= 200 chars
  scriptureRef?: string;
  /**
   * Markdown. For reading plans, use one "## Day N — Title" section per day
   * listing the passages to read and a short original reflection question.
   */
  body: string;
  sortOrder: number;
};

export type DailyVerse = {
  ref: string; // "Psalm 46:1"
  text: string; // exact WEB text
  translation: Translation;
};

export type ChallengeDaySeed = {
  dayNumber: number; // 1..10
  title: string;
  theme: string;
  scriptureRef: string;
  scriptureText: string; // exact WEB text
  body: string; // Markdown devotional, 500-800 words, original
  reflection: string; // audio reflection script, 180-260 words, spoken style
  prayer: string; // 80-150 words
  journalPrompts: string[]; // 3 prompts
};
