import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
export default function StatsLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Stats",
          headerShadowVisible: false,
          headerTransparent: true,
          headerBlurEffect: colorScheme === "light" ? "systemChromeMaterialLight" : "systemChromeMaterialDark",
          headerSearchBarOptions: {
            placeholder: "Search for Runners",
          },
        }}
      />
    </Stack>
  );
}
