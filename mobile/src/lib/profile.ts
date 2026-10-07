import AsyncStorage from "@react-native-async-storage/async-storage";

/** What the user told us on first launch, used to personalise copy. Stored on the device only. */
export type Profile = {
  name: string;
  reason: "peace" | "closer" | "habit" | "family" | "grief";
  time: "morning" | "midday" | "evening";
  onboarded: boolean;
};

const KEY = "op_profile";

export const REASONS: { id: Profile["reason"]; label: string; sub: string }[] = [
  { id: "peace", label: "Peace from worry", sub: "My mind won’t rest" },
  { id: "closer", label: "Closer to God", sub: "I feel far away" },
  { id: "habit", label: "A daily habit", sub: "I start, then stop" },
  { id: "family", label: "My family", sub: "People I carry" },
  { id: "grief", label: "Grief or loss", sub: "A heavy season" },
];

export const TIMES: { id: Profile["time"]; label: string; hour: number }[] = [
  { id: "morning", label: "Morning", hour: 7 },
  { id: "midday", label: "Midday", hour: 12 },
  { id: "evening", label: "Evening", hour: 21 },
];

export async function loadProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(p: Profile): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}
