/**
 * oneprayer.church API. Public reads work today; actions that need an account
 * (I Prayed, posting) need the mobile sign-in endpoint that is still to be added
 * to the site's server (the site only accepts its own browser origin for writes).
 */
export const SITE = "https://oneprayer.church";

export type PrayerRequest = {
  id: string;
  displayName: string | null;
  isAnonymous: boolean;
  category: string;
  title: string;
  body: string;
  prayedCount: number;
  replyCount: number;
  createdAt: string;
  answeredAt: string | null;
};

type Page<T> = { items: T[]; total: number; page: number; pages: number };

export async function listPrayers(page = 1): Promise<Page<PrayerRequest>> {
  const res = await fetch(`${SITE}/api/prayers?sort=newest&page=${page}&pageSize=20`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Could not load prayer requests (${res.status}).`);
  return (await res.json()) as Page<PrayerRequest>;
}

export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}
