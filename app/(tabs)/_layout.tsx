import React from "react";
import { Tabs } from "@/components/NativeBottomTabs";
import { useMMKVBoolean } from "react-native-mmkv";
import { useColorsForUI } from "@/hooks/useColorsForUI";

export default function TabLayout() {
  const [haptics] = useMMKVBoolean("settings-haptics");
  const { tintColor } = useColorsForUI();

  return (
    <Tabs
      ignoresTopSafeArea
      hapticFeedbackEnabled={haptics}
      screenOptions={{
        tabBarActiveTintColor: tintColor,
      }}
    >
      {/* HOME SCREEN - Paces */}
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarLabel: "PaceMan.gg",

          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? { sfSymbol: "stopwatch.fill" } : { sfSymbol: "stopwatch" },
        }}
      />

      {/* LEADERBOARD SCREEN */}
      <Tabs.Screen
        name="lb"
        options={{
          headerShown: false,
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? { sfSymbol: "medal.fill" } : { sfSymbol: "medal" },
        }}
        initialParams={{ id: "monthly" }}
      />

      {/* STATS SCREEN */}
      <Tabs.Screen
        name="stats"
        options={{
          headerShown: false,
          tabBarLabel: "Stats",
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? { sfSymbol: "chart.bar.fill" } : { sfSymbol: "chart.bar" },
        }}
      />
    </Tabs>
  );
}
