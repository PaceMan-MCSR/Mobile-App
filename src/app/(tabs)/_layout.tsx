import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { storage } from "@/lib/utils/mmkv";
import * as Haptics from "expo-haptics";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";

export default function TabsLayout() {
  const [haptics] = useMMKVBoolean("settings-haptics", storage);
  const { tintColor, backgroundColor, tabBarTintColor } = useColorsForUI();

  return (
    <NativeTabs
      tintColor={tintColor}
      rippleColor={tabBarTintColor}
      indicatorColor={tabBarTintColor}
      labelVisibilityMode="labeled"
      blurEffect="none"
      backgroundColor={Platform.select({ ios: undefined, android: backgroundColor })}
      screenListeners={{
        tabPress: () => {
          if (haptics) void Haptics.selectionAsync();
        },
      }}
    >
      {/* HOME PAGE */}
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>PaceMan.gg</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "stopwatch", selected: "stopwatch.fill" }} md={"timer"} />
      </NativeTabs.Trigger>
      {/* LEADERBOARD  PAGE */}
      <NativeTabs.Trigger name="lb">
        <NativeTabs.Trigger.Label>Leaderboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "trophy", selected: "trophy.fill" }} md={"trophy"} />
      </NativeTabs.Trigger>
      {/* STATS PAGE */}
      <NativeTabs.Trigger name="stats">
        <NativeTabs.Trigger.Label>Stats</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} md={"bar_chart"} />
      </NativeTabs.Trigger>
      {/* SETTINGS PAGE */}
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} md={"settings"} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
