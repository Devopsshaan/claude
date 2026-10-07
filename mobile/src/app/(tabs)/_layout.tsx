import { Tabs } from "expo-router";
import { SymbolView, type SFSymbol } from "expo-symbols";
import type { ColorValue } from "react-native";
import { colors, fonts } from "@/theme";

const icon = (name: SFSymbol) =>
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
      <Tabs.Screen name="index" options={{ title: "Today", tabBarIcon: icon("sun.max") }} />
      <Tabs.Screen name="pray" options={{ title: "Pray", tabBarIcon: icon("hands.sparkles") }} />
      <Tabs.Screen name="membership" options={{ title: "Membership", tabBarIcon: icon("crown") }} />
    </Tabs>
  );
}
