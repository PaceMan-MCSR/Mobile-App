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
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "podium" : "podium-outline"} color={color} />,
        }}
        initialParams={{ id: "monthly" }}
      />

      {/* EVENTS SCREEN */}
      <Tabs.Screen
        name="events/[id]"
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
        initialParams={{ id: "latest" }}
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
