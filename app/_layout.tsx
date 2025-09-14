import { useColorsForUI } from "@/hooks/useColorsForUI";
import { storage } from "@/lib/utils/mmkv";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "@/global.css";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
const queryClient = new QueryClient();

export default function RootLayout() {
  const [theme, setTheme] = useMMKVString("settings-theme", storage);
  const [haptics, setHaptics] = useMMKVBoolean("settings-haptics", storage);
  const { colorScheme, setColorScheme } = useColorScheme();
  const { tintColor, backgroundColor } = useColorsForUI();

  // Fixes flicker on Android while switching between screens.
  SystemUI.setBackgroundColorAsync(backgroundColor);
  SplashScreen.preventAutoHideAsync();

  // Initialise MMKV
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    if (theme === undefined) {
      setTheme("dark");
    }
    if (haptics === undefined) {
      setHaptics(true);
    }
    SplashScreen.hideAsync();
  }, []);

  // Update Theme
  useEffect(() => setColorScheme(theme as "light" | "dark" | "system"), [theme]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack
              screenOptions={{
                headerTintColor: tintColor,
                headerShadowVisible: false,
                headerTransparent: Platform.select({
                  ios: true,
                  android: false,
                }),
                headerStyle: {
                  backgroundColor: Platform.select({
                    android: backgroundColor,
                  }),
                },
              }}
            >
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
                  headerBackButtonDisplayMode: "minimal",
                }}
              />
              <Stack.Screen
                name="stats/player/[id]"
                options={{
                  headerBackButtonDisplayMode: "minimal",
                }}
              />
              <Stack.Screen
                name="+not-found"
                options={{
                  headerTitle: "Page Not Found",
                  headerBackButtonDisplayMode: "minimal",
                }}
              />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
