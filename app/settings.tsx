import React from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/utils/mmkv";
import { useColorScheme } from "nativewind";
import { useColorsForUI } from "@/hooks/useColorsForUI";

const SettingsPage = () => {
  const { setColorScheme } = useColorScheme();
  const [theme, setTheme] = useMMKVString("settings-theme", storage);
  const [haptics, setHaptics] = useMMKVBoolean("settings-haptics", storage);
  const { checkboxColor } = useColorsForUI();
  return (
    <View className="flex flex-1 bg-background-primary">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4">
        {/* APPEARANCE SETTINGS */}
        <Text className="text-text-primary text-2xl font-bold py-3">Appearance</Text>
        <View className="bg-background-secondary gap-4 p-4 mb-8 rounded-xl">
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-text-primary font-semibold text-xl">System</Text>
            <Checkbox
              value={theme === ""}
              onValueChange={() => {
                setColorScheme("system");
                setTheme("");
              }}
              color={checkboxColor}
            />
          </View>
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-text-primary font-semibold text-xl">Light</Text>
            <Checkbox
              value={theme === "light"}
              onValueChange={() => {
                setColorScheme("light");
                setTheme("light");
              }}
              color={checkboxColor}
            />
          </View>
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-text-primary font-semibold text-xl">Dark</Text>
            <Checkbox
              value={theme === "dark"}
              onValueChange={() => {
                setColorScheme("dark");
                setTheme("dark");
              }}
              color={checkboxColor}
            />
          </View>
        </View>
        {/* Accessibility Settings */}
        <Text className="text-text-primary text-2xl font-bold py-3">Accessibility</Text>
        <View className="bg-background-secondary gap-2 p-4 mb-8 rounded-xl">
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-text-primary font-semibold text-xl">Tab Bar Haptics</Text>
            <Checkbox value={haptics} onValueChange={setHaptics} color={checkboxColor} />
          </View>
          <Text className="flex flex-1 text-text-primary text-sm">
            Toggle haptic feedback effect on the bottom tab bar.
          </Text>
        </View>
        <Text className="text-text-primary text-2xl font-bold py-3">About</Text>
        <View className="bg-background-secondary gap-4  p-4 rounded-xl">
          <Text className="flex flex-1 text-text-primary text-md">
            Note: PaceMan.gg is a community run real-time speedrun tracker. PaceMan.gg is not affiliated or endorsed by
            "Minecraft" or "Mojang".
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;
