import { useColorsForUI } from "@/hooks/useColorsForUI";
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
          headerTitle: "Stats",
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
          headerBlurEffect: colorScheme === "light" ? "systemChromeMaterialLight" : "systemChromeMaterialDark",
        }}
      />
    </Stack>
  );
}
