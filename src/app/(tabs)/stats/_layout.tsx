import { useScreenOptions } from "@/hooks/use-screen-options";
import { Stack } from "expo-router";

export default function StatsLayout() {
  const screenOptions = useScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Stats",
        }}
      />
    </Stack>
  );
}
