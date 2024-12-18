import * as SystemUI from "expo-system-ui";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { storage } from "@/lib/utils/mmkv";
import { Platform } from "react-native";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useMMKVString } from "react-native-mmkv";
import { useColorsForUI } from "@/hooks/useColorsForUI";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import "@/global.css";
const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { tintColor, backgroundColor } = useColorsForUI();
  SystemUI.setBackgroundColorAsync(backgroundColor);
  const [theme] = useMMKVString("settings-theme");

  // Update App Theme
  useEffect(() => {
    if (theme === "") setColorScheme("system");
    if (theme === "light") setColorScheme("light");
    if (theme === "dark") setColorScheme("dark");
  }, [theme]);

  // useEffect(() => {
  //   console.log(colorScheme);
  // }, [colorScheme]);

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
            <StatusBar style={colorScheme === "light" ? "dark" : colorScheme === "dark" ? "light" : "auto"} />
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
                  headerBackTitle: "Back",
                  headerTintColor: tintColor,
                  headerShadowVisible: false,
                  headerTransparent: Platform.OS === "ios" ? true : false,
                  headerBlurEffect: colorScheme === "light" ? "systemChromeMaterialLight" : "systemChromeMaterialDark",
                }}
              />
              <Stack.Screen
                name="stats/player/[id]"
                options={{
                  headerBackTitle: "Back",
                  headerTintColor: tintColor,
                  headerShadowVisible: false,
                  headerTransparent: Platform.OS === "ios" ? true : false,
                  headerBlurEffect: colorScheme === "light" ? "systemChromeMaterialLight" : "systemChromeMaterialDark",
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
