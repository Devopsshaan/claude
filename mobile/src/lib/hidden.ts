import AsyncStorage from "@react-native-async-storage/async-storage";

/** Prayer requests the user chose to hide or report on this device (Apple 1.2: users can hide content). */
const KEY = "op_hidden_requests";

export async function loadHidden(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function hideRequest(id: string): Promise<string[]> {
  const list = await loadHidden();
  if (!list.includes(id)) list.push(id);
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(list.slice(-500)));
  } catch {}
  return list;
}
