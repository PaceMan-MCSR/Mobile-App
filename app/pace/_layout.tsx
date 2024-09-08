import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { nickname, liveAccount } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: `${liveAccount ? "[LIVE] " : ""}${nickname ? `${nickname}` : "Pace"}`,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />
    </Stack>
  );
}
