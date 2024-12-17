import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "nativewind";
export default function StatsLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Leaderboard",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
        initialParams={{ id: "monthly" }}
      />
    </Stack>
  );
}
