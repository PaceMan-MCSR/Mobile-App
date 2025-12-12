/* 
Inspired from https://github.com/arunabhverma/expo-native-header-and-bottom-tabs/blob/main/hooks/useScreenOptions.ts
*/
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useColorScheme } from "nativewind";
import { Platform } from "react-native";

export const useScreenOptions = (): NativeStackNavigationOptions => {
  const { colorScheme } = useColorScheme();
  const { backgroundColor } = useColorsForUI();
  return {
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
    headerBlurEffect: !isLiquidGlassAvailable()
      ? colorScheme === "light"
        ? "systemChromeMaterialLight"
        : "systemChromeMaterialDark"
      : "none",
    headerBackButtonDisplayMode: "minimal",
  };
};
