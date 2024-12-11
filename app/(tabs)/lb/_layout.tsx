import { Stack } from "expo-router";

export default function StatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Leaderboard",
          headerShadowVisible: false,
          headerTransparent: true,
          headerBlurEffect: "systemThinMaterial",
        }}
        initialParams={{ id: "monthly" }}
      />
    </Stack>
  );
}
