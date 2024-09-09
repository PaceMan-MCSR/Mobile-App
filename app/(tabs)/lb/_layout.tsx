import { Colors } from "@/constants/Colors";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { id } = useGlobalSearchParams<{ id?: string }>();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: `Leaderboard ${id}`,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: `Leaderboard - ${id ? id.charAt(0).toUpperCase() + id.slice(1).toLowerCase() : "All"}`,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />
    </Stack>
  );
}
