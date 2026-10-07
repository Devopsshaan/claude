import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { TIMES, type Profile } from "./profile";

/** One gentle daily reminder at the hour the user chose. Never more than one a day. */
const ID = "daily-prayer";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function scheduleDailyReminder(time: Profile["time"], name?: string): Promise<boolean> {
  if (Platform.OS === "web") return false;
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
