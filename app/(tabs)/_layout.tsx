import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      {/* HOME SCREEN - Paces */}

      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "PaceMan.gg",
          headerShadowVisible: false,
          tabBarLabel: "PaceMan",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "stopwatch" : "stopwatch-outline"} color={color} />
          ),
        }}
      />

      {/* LEADERBOARD SCREEN */}

      <Tabs.Screen
        name="lb"
        options={{
          headerTitle: "Leaderboard",
          headerShadowVisible: false,
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "stats-chart" : "stats-chart-outline"} color={color} />
          ),
        }}
      />

      {/* EVENTS SCREEN */}

      <Tabs.Screen
        name="events"
        options={{
          headerTitle: "Events",
          headerShadowVisible: false,
          tabBarLabel: "Events",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "calendar" : "calendar-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
