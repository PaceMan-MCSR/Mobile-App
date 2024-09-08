import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import "@/global.css";
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  Platform.OS === "android" && NavigationBar.setBackgroundColorAsync(Colors[colorScheme ?? "light"].background);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="pace"
            options={{
              presentation: "modal",
              headerShown: false,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
