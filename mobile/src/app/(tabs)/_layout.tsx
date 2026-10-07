import { Tabs } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ColorValue } from "react-native";
import { colors, fonts } from "@/theme";

const icon = (name: SymbolViewProps["name"]) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <SymbolView name={name} tintColor={color} size={24} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold400,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.navy950, borderTopColor: "rgba(240,214,154,0.15)" },
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Today", tabBarIcon: icon({ ios: "sun.max", android: "light_mode" }) }} />
      <Tabs.Screen name="pray" options={{ title: "Pray", tabBarIcon: icon({ ios: "hands.sparkles", android: "volunteer_activism" }) }} />
      <Tabs.Screen name="membership" options={{ title: "Membership", tabBarIcon: icon({ ios: "crown", android: "workspace_premium" }) }} />
    </Tabs>
  );
}
