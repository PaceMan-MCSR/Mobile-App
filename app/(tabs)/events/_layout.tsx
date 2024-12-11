import { Stack } from "expo-router";

export default function StatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Events",
          headerShadowVisible: false,
          headerTransparent: true,
          headerBlurEffect: "systemThinMaterial",
        }}
        initialParams={{ id: "latest" }}
      />
    </Stack>
  );
}
