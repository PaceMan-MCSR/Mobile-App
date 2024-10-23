import React from "react";
import { Tabs, useGlobalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";
import LBDropdownMenu from "@/components/LBDropdownMenu";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { lbType = "all" } = useGlobalSearchParams<{ lbType: string }>();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      {/* HOME SCREEN - Paces */}
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "PaceMan.gg",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarLabel: "PaceMan",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "stopwatch" : "stopwatch-outline"} color={color} />
          ),
        }}
      />

      {/* LEADERBOARD SCREEN */}
      <Tabs.Screen
        name="lb/[id]"
        options={{
          headerTitle: "Leaderboard",
          headerRight: () => <LBDropdownMenu onSelect={() => console.log("Hey")} selectedKey={lbType} />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "podium" : "podium-outline"} color={color} />,
        }}
        initialParams={{ id: lbType }}
      />

      {/* EVENTS SCREEN */}
      <Tabs.Screen
        name="events"
        options={{
          headerTitle: "Events",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarLabel: "Events",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "calendar" : "calendar-outline"} color={color} />
          ),
        }}
      />

      {/* STATS SCREEN */}
      <Tabs.Screen
        name="stats"
        options={{
          headerTitle: "Stats",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarLabel: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "stats-chart" : "stats-chart-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
