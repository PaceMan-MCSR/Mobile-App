// For when nativewind classnames can't be used.
// Primarily for tab bar and header tints/styles

import { useColorScheme } from "nativewind";

export const useColorsForUI = () => {
  const { colorScheme } = useColorScheme();

  const tintColor = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const backgroundColor = colorScheme === "dark" ? "#1f2937" : "#FFFFFF";
  const checkboxColor = colorScheme === "dark" ? "#777777" : "#000000";

  return { tintColor, backgroundColor, checkboxColor };
};
