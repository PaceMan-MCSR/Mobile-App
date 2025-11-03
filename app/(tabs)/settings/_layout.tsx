import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { Platform } from "react-native";

export default function StatsLayout() {
  const { colorScheme } = useColorScheme();

  const { backgroundColor } = useColorsForUI();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Settings",
          headerShadowVisible: false,
          headerTransparent: Platform.select({
            ios: true,
            android: false,
          }),
          headerStyle: {
            backgroundColor: Platform.select({
              android: backgroundColor,
            }),
          },
          headerBlurEffect: !isLiquidGlassAvailable()
            ? colorScheme === "light"
              ? "systemChromeMaterialLight"
              : "systemChromeMaterialDark"
            : "none",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerTitle: "Notifications",
          headerShadowVisible: false,
          headerTransparent: Platform.select({
            ios: true,
            android: false,
          }),
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: Platform.select({
              android: backgroundColor,
            }),
          },
          headerBlurEffect: !isLiquidGlassAvailable()
            ? colorScheme === "light"
              ? "systemChromeMaterialLight"
              : "systemChromeMaterialDark"
            : "none",
        }}
      />
    </Stack>
  );
}
