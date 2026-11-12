// For when nativewind classnames can't be used.
// Primarily for tab bar and header tints/styles

import { useColorScheme } from "nativewind";

export const useColorsForUI = () => {
  const { colorScheme } = useColorScheme();

  const tintColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const backgroundColor = colorScheme === "dark" ? "#1f2937" : "#FFFFFF";
  const checkboxColor = colorScheme === "dark" ? "#777777" : "#000000";
  const tabBarRippleColor = colorScheme === "dark" ? "#FFFFFF1F" : "#0000001F";
  const tabBarInactiveColor = colorScheme === "dark" ? "#9CA3AF" : "#6B7280";
  const tabBarIndicatorColor = colorScheme === "dark" ? "#374151" : "#E5E7EB";

  return { tintColor, backgroundColor, checkboxColor, tabBarRippleColor, tabBarInactiveColor, tabBarIndicatorColor };
};
