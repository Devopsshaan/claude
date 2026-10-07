import { Platform } from "react-native";
import Constants from "expo-constants";
import { TIMES, type Profile } from "./profile";

/**
 * One gentle daily reminder at the hour the user chose. Never more than one a day.
 *
 * expo-notifications is loaded lazily: importing it inside Expo Go on Android throws
 * (removed from Expo Go since SDK 53), so reminders are skipped there and work in the
 * development / App Store builds.
 */
const ID = "daily-prayer";
const inExpoGo = Constants.appOwnership === "expo";

type Notif = typeof import("expo-notifications");
let mod: Notif | null | undefined;
function load(): Notif | null {
  if (mod !== undefined) return mod;
  if (inExpoGo || Platform.OS === "web") return (mod = null);
  try {
    mod = require("expo-notifications") as Notif;
    mod.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
    });
  } catch {
    mod = null;
  }
  return mod;
}

export async function scheduleDailyReminder(time: Profile["time"], name?: string): Promise<boolean> {
  const Notifications = load();
  if (!Notifications) return false;
  const perm = await Notifications.requestPermissionsAsync();
  if (!perm.granted) return false;
  const hour = TIMES.find((t) => t.id === time)?.hour ?? 7;
  await Notifications.cancelScheduledNotificationAsync(ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: {
      title: name ? `${name}, your candle is waiting` : "Your candle is waiting",
      body: "Two minutes of prayer, and your chapel grows a little more.",
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0 },
  });
  return true;
}
