import { storage } from "@/lib/utils/mmkv";
import { Platform } from "react-native";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { useMMKVBoolean } from "react-native-mmkv";
import { withLayoutContext } from "expo-router";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
const Tabs = withLayoutContext(createNativeBottomTabNavigator().Navigator);

export default function TabLayout() {
  const [haptics, setHaptics] = useMMKVBoolean("settings-haptics", storage);
  const { tintColor, backgroundColor, tabBarTintColor } = useColorsForUI();

  return (
    <Tabs
      ignoresTopSafeArea
      hapticFeedbackEnabled={haptics}
      tabBarActiveTintColor={tintColor}
      activeIndicatorColor={tabBarTintColor}
      disablePageAnimations={Platform.select({
        ios: false,
        android: true,
      })}
      tabBarStyle={{
        backgroundColor: Platform.select({
          ios: undefined,
          android: backgroundColor,
        }),
      }}
    >
      {/* HOME SCREEN - PACE */}
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarLabel: "PaceMan.gg",

          tabBarIcon: Platform.select({
            ios: ({ focused }: { focused: boolean }) =>
              focused ? { sfSymbol: "stopwatch.fill" } : { sfSymbol: "stopwatch" },
            android: ({ focused }) =>
              focused ? require("@/assets/icons/stopwatch.svg") : require("@/assets/icons/stopwatch-outline.svg"),
          }),
        }}
      />
      {/* LEADERBOARD SCREEN */}
      <Tabs.Screen
        name="lb"
        options={{
          headerShown: false,
          tabBarLabel: "Leaderboard",
          tabBarIcon: Platform.select({
            ios: ({ focused }: { focused: boolean }) => (focused ? { sfSymbol: "medal.fill" } : { sfSymbol: "medal" }),
            android: ({ focused }) =>
              focused ? require("@/assets/icons/trophy.svg") : require("@/assets/icons/trophy-outline.svg"),
          }),
        }}
        initialParams={{ id: "monthly" }}
      />
      {/* STATS SCREEN */}
      <Tabs.Screen
        name="stats"
        options={{
          headerShown: false,
          tabBarLabel: "Stats",
          tabBarIcon: Platform.select({
            ios: ({ focused }: { focused: boolean }) =>
              focused ? { sfSymbol: "chart.bar.fill" } : { sfSymbol: "chart.bar" },
            android: ({ focused }) =>
              focused ? require("@/assets/icons/stats-chart.svg") : require("@/assets/icons/stats-chart-outline.svg"),
          }),
        }}
      />
    </Tabs>
  );
}
