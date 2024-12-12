import React from "react";
import { Tabs } from "@/components/NativeBottomTabs";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      ignoresTopSafeArea
      hapticFeedbackEnabled
      labeled
      barTintColor={Colors[colorScheme ?? "light"].background}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].pickerTint,
      }}
    >
      {/* HOME SCREEN - Paces */}
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarLabel: "PaceMan.gg",
          tabBarIcon: () => ({ sfSymbol: "speedometer" }),
        }}
      />

      {/* LEADERBOARD SCREEN */}
      <Tabs.Screen
        name="lb"
        options={{
          headerShown: false,
          tabBarLabel: "Leaderboard",
          tabBarIcon: () => ({ sfSymbol: "medal" }),
        }}
        initialParams={{ id: "monthly" }}
      />

      {/* STATS SCREEN */}
      <Tabs.Screen
        name="stats"
        options={{
          headerShown: false,
          tabBarLabel: "Stats",
          tabBarIcon: () => ({ sfSymbol: "chart.bar" }),
        }}
      />
    </Tabs>
  );
}
