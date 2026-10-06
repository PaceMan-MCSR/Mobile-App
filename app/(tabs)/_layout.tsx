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
      labelVisibilityMode="labeled"
      tintColor={tintColor}
      indicatorColor={tabBarTintColor}
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
        <NativeTabs.Trigger.Icon
          sf={{ default: "stopwatch", selected: "stopwatch.fill" }}
          md={{ default: "timer", selected: "timer_play" }}
        />
      </NativeTabs.Trigger>
      {/* LEADERBOARD  PAGE */}
      <NativeTabs.Trigger name="lb">
        <NativeTabs.Trigger.Label>Leaderboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "medal", selected: "medal.fill" }}
          md={{ default: "military_tech", selected: "workspace_premium" }}
        />
      </NativeTabs.Trigger>
      {/* STATS PAGE */}
      <NativeTabs.Trigger name="stats">
        <NativeTabs.Trigger.Label>Stats</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
          md={{ default: "bar_chart", selected: "stacked_bar_chart" }}
        />
      </NativeTabs.Trigger>
      {/* SETTINGS PAGE */}
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md={{ default: "settings", selected: "settings_suggest" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
