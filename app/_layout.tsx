import * as SystemUI from "expo-system-ui";
import { Stack } from "expo-router";
import { storage } from "@/lib/utils/mmkv";
import { Platform } from "react-native";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import "@/global.css";
const queryClient = new QueryClient();

export default function RootLayout() {
  const theme = storage.getString("settings-theme");
  const { colorScheme } = useColorScheme();
  const { tintColor, backgroundColor } = useColorsForUI();

  // Fixes flicker on Android while switching between screens.
  SystemUI.setBackgroundColorAsync(backgroundColor);

  // Initialise MMKV Storage with User Preferences
  useEffect(() => {
    if (!storage.contains("settings-theme")) {
      storage.set("settings-theme", "system");
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
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
                headerBlurEffect: colorScheme === "light" ? "systemChromeMaterialLight" : "systemChromeMaterialDark",
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
                  headerBackTitle: "Back",
                }}
              />
              <Stack.Screen
                name="stats/player/[id]"
                options={{
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
