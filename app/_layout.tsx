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
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/utils/mmkv";

import "@/global.css";
import { useEffect } from "react";
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  Platform.OS === "android" && NavigationBar.setBackgroundColorAsync(Colors[colorScheme ?? "light"].background);
  SystemUI.setBackgroundColorAsync(Colors[colorScheme ?? "light"].background);
  const [theme] = useMMKVString("settings-theme");

  // Update App Theme
  useEffect(() => {
    if (theme === "") Appearance.setColorScheme(null);
    if (theme === "light") Appearance.setColorScheme("light");
    if (theme === "dark") Appearance.setColorScheme("dark");
  }, [theme]);

  // Initialise MMKV Storage with User Preferences
  useEffect(() => {
    if (!storage.contains("settings-theme")) {
      storage.set("settings-theme", "");
    }
    if (!storage.contains("settings-haptics")) {
      storage.set("settings-theme", Platform.OS === "ios" ? true : false);
    }
  }, []);

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
                  headerTintColor: Colors[colorScheme ?? "light"].text,
                  headerBackTitle: "Back",
                  headerStyle: {
                    backgroundColor: Platform.OS === "ios" ? undefined : Colors[colorScheme ?? "light"].background,
                  },
                  headerShadowVisible: false,
                  headerTransparent: Platform.OS === "ios" ? true : false,
                  headerBlurEffect: "systemThinMaterial",
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
