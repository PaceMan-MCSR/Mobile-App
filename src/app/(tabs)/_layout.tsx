import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { storage } from "@/lib/utils/mmkv";
import * as Haptics from "expo-haptics";
import { NativeTabs } from "expo-router/native-tabs";
import { Platform } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";

// Defined once at module level so the triggers keep the same identity across re-renders.
// expo-router rebuilds tab options whenever NativeTabs' children change, and on Android every
// rebuild re-renders `md` icons to new PNG files, which makes the icons blink while they reload.
const TAB_TRIGGERS = [
  // HOME PAGE
  <NativeTabs.Trigger key="(home)" name="(home)">
    <NativeTabs.Trigger.Label>PaceMan.gg</NativeTabs.Trigger.Label>
    <NativeTabs.Trigger.Icon sf={{ default: "stopwatch", selected: "stopwatch.fill" }} md={"timer"} />
  </NativeTabs.Trigger>,
  // LEADERBOARD PAGE
  <NativeTabs.Trigger key="lb" name="lb">
    <NativeTabs.Trigger.Label>Leaderboard</NativeTabs.Trigger.Label>
    <NativeTabs.Trigger.Icon sf={{ default: "trophy", selected: "trophy.fill" }} md={"trophy"} />
  </NativeTabs.Trigger>,
  // STATS PAGE
  <NativeTabs.Trigger key="stats" name="stats">
    <NativeTabs.Trigger.Label>Stats</NativeTabs.Trigger.Label>
    <NativeTabs.Trigger.Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} md={"bar_chart"} />
  </NativeTabs.Trigger>,
  // SETTINGS PAGE
  <NativeTabs.Trigger key="settings" name="settings">
    <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
    <NativeTabs.Trigger.Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} md={"settings"} />
  </NativeTabs.Trigger>,
];

export default function TabsLayout() {
  const [haptics] = useMMKVBoolean("settings-haptics", storage);
  const { tintColor, backgroundColor, tabBarRippleColor, tabBarInactiveColor, tabBarIndicatorColor } = useColorsForUI();

  return (
    <NativeTabs
      tintColor={tintColor}
      iconColor={{ default: tabBarInactiveColor, selected: tintColor }}
      labelStyle={{ default: { color: tabBarInactiveColor }, selected: { color: tintColor } }}
      rippleColor={tabBarRippleColor}
      indicatorColor={tabBarIndicatorColor}
      labelVisibilityMode="labeled"
      blurEffect="none"
      backgroundColor={Platform.select({ ios: undefined, android: backgroundColor })}
      screenListeners={{
        tabPress: () => {
          if (haptics) void Haptics.selectionAsync();
        },
      }}
    >
      {TAB_TRIGGERS}
    </NativeTabs>
  );
}
