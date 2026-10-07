import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { doorSeenToday } from "@/lib/store";
import { colors } from "@/theme";

/** First open of the day shows the door (like the website); after that, straight to Today. */
export default function Start() {
  const [seen, setSeen] = useState<boolean | null>(null);
  useEffect(() => {
    doorSeenToday().then(setSeen);
  }, []);
  if (seen === null) return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  return <Redirect href={seen ? "/(tabs)" : "/door"} />;
}
