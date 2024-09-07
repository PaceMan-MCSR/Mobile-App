import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { nickname, liveAccount } = useLocalSearchParams();
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: `${liveAccount ? "[LIVE] " : ""}${nickname}`,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />
    </Stack>
  );
}
