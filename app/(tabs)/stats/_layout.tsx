import { Stack } from "expo-router";

export default function StatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="player"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="run"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
