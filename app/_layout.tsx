import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Platform, Appearance } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SystemUI from "expo-system-ui";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import "@/global.css";
import { useEffect } from "react";
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  Platform.OS === "android" && NavigationBar.setBackgroundColorAsync(Colors[colorScheme ?? "light"].background);
  SystemUI.setBackgroundColorAsync(Colors[colorScheme ?? "light"].background);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
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
                  headerTintColor: Colors[colorScheme ?? "light"].text,
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
