import { Stack } from "expo-router";
import { Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { useColorsForUI } from "@/hooks/useColorsForUI";

export default function StatsLayout() {
  const { colorScheme } = useColorScheme();
  const { backgroundColor } = useColorsForUI();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "PaceMan.gg",
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
