import AsyncStorage from "@react-native-async-storage/async-storage";
import { utcDayNumber } from "./word";

const DOOR_KEY = "op_door_day";
const PRAYED_KEY = "op_prayed_days";

/** Local calendar day, like the website's door ("shown once a day"). */
export function localDay(d: Date = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export async function doorSeenToday(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(DOOR_KEY)) === localDay();
  } catch {
    return false;
  }
}

export async function rememberDoor(): Promise<void> {
  try {
    await AsyncStorage.setItem(DOOR_KEY, localDay());
  } catch {}
}

/** Days (UTC day numbers, matching the Word) on which the user received their Word. */
async function prayedDays(): Promise<number[]> {
  try {
    const raw = await AsyncStorage.getItem(PRAYED_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export async function markPrayedToday(): Promise<number[]> {
  const today = utcDayNumber(new Date());
  const days = await prayedDays();
  if (!days.includes(today)) days.push(today);
  const recent = days.filter((d) => d > today - 400).sort((a, b) => a - b);
  try {
    await AsyncStorage.setItem(PRAYED_KEY, JSON.stringify(recent));
  } catch {}
  return recent;
}

export async function loadPrayedDays(): Promise<number[]> {
  return prayedDays();
}

/** Consecutive days ending today (or yesterday, so the streak isn't lost before today's Word). */
export function streakFrom(days: number[], today = utcDayNumber(new Date())): number {
  const set = new Set(days);
  let d = set.has(today) ? today : today - 1;
  let n = 0;
  while (set.has(d)) {
    n++;
    d--;
  }
  return n;
}
