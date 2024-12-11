import { Stack } from "expo-router";

export default function StatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "PaceMan.gg",
          headerShadowVisible: false,
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
        }}
      />
    </Stack>
  );
}
