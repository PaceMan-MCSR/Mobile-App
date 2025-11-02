import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { storage } from "@/lib/utils/mmkv";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import { withLayoutContext } from "expo-router";
import { Platform } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
const Tabs = withLayoutContext(createNativeBottomTabNavigator().Navigator);

export default function TabLayout() {
  const [haptics] = useMMKVBoolean("settings-haptics", storage);
  const { tintColor, backgroundColor, tabBarTintColor } = useColorsForUI();

  return (
    <Tabs
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
            ios: () => ({ sfSymbol: "stopwatch" }),
            android: ({ focused }: { focused: boolean }) =>
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
            ios: () => ({ sfSymbol: "medal" }),
            android: ({ focused }: { focused: boolean }) =>
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
            ios: () => ({ sfSymbol: "chart.bar" }),
            android: ({ focused }: { focused: boolean }) =>
              focused ? require("@/assets/icons/stats-chart.svg") : require("@/assets/icons/stats-chart-outline.svg"),
          }),
        }}
      />
    </Tabs>
  );
}
