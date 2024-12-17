import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function StatsLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Leaderboard",
          headerShadowVisible: false,
          headerTransparent: true,
          headerBlurEffect: colorScheme === "light" ? "systemChromeMaterialLight" : "systemChromeMaterialDark",
        }}
        initialParams={{ id: "monthly" }}
      />
    </Stack>
  );
}
