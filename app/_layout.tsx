import NotificationsToastComponent from "@/components/notifications-toast";
import "@/global.css";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { useScreenOptions } from "@/hooks/use-screen-options";
import { storage } from "@/lib/utils/mmkv";
import { NotificationsProvider } from "@/providers/notifications";
import { PrefetcherProvider } from "@/providers/prefetcher";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";

const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [theme, setTheme] = useMMKVString("settings-theme", storage);
  const [haptics, setHaptics] = useMMKVBoolean("settings-haptics", storage);
  const { colorScheme, setColorScheme } = useColorScheme();
  const { backgroundColor } = useColorsForUI();
  const screenOptions = useScreenOptions();

  // Fixes flicker on Android while switching between screens.
  SystemUI.setBackgroundColorAsync(backgroundColor);
  SplashScreen.preventAutoHideAsync();

  // useEffect(() => devClientItems(), []);

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

  // React Query DevTools
  useReactQueryDevTools(queryClient);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationsProvider>
            <PrefetcherProvider>
              <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
                <Stack screenOptions={screenOptions}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerTitle: "Home",
                      headerShown: false,
                    }}
                    initialParams={{ lbType: "monthly" }}
                  />
                  <Stack.Screen name="stats/player/[id]" />
                  <Stack.Screen name="stats/run/[worldId]" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <NotificationsToastComponent />
              </ThemeProvider>
            </PrefetcherProvider>
          </NotificationsProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
