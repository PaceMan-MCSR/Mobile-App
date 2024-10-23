import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import "@/global.css";
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  Platform.OS === "android" && NavigationBar.setBackgroundColorAsync(Colors[colorScheme ?? "light"].background);

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
                initialParams={{ lbType: "monthly" }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  headerTitle: "Settings",
                  headerStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                  },
                  presentation: "modal",
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </ActionSheetProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
