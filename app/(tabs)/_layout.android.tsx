import React from "react";
import { Tabs } from "@/components/NativeBottomTabs";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
import { useMMKVBoolean } from "react-native-mmkv";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [haptics] = useMMKVBoolean("settings-haptics");
  return (
    <Tabs
      ignoresTopSafeArea
      hapticFeedbackEnabled={haptics}
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
          tabBarIcon: () => ({ sfSymbol: "stopwatch.fill" }),
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
