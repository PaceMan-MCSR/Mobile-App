import { useScreenOptions } from "@/hooks/use-screen-options";
import { Stack } from "expo-router";

export default function LeaderboardLayout() {
  const screenOptions = useScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Leaderboard",
        }}
        initialParams={{ id: "monthly" }}
      />
    </Stack>
  );
}
