import React, { useEffect, useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/utils/mmkv";

const SettingsPage = () => {
  const [theme, setTheme] = useMMKVString("settings-theme", storage);
  const [haptics, setHaptics] = useMMKVBoolean("settings-haptics", storage);

  return (
    <View className="flex flex-1 bg-white dark:bg-[#111827]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4">
        {/* APPEARANCE SETTINGS */}
        <Text className="text-white text-2xl font-bold py-3">Appearance</Text>
        <View className="bg-gray-300 gap-4 dark:bg-[#1f2937] p-4 mb-8 rounded-xl">
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-white font-semibold text-xl">System</Text>
            <Checkbox
              value={theme === ""}
              onValueChange={() => {
                setTheme("");
              }}
            />
          </View>
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-white font-semibold text-xl">Light</Text>
            <Checkbox
              value={theme === "light"}
              onValueChange={() => {
                setTheme("light");
              }}
            />
          </View>
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-white font-semibold text-xl">Dark</Text>
            <Checkbox
              value={theme === "dark"}
              onValueChange={() => {
                setTheme("dark");
              }}
            />
          </View>
        </View>
        {/* Accessibility Settings */}
        <Text className="text-white text-2xl font-bold py-3">Accessibility</Text>
        <View className="bg-gray-300 gap-2 dark:bg-[#1f2937] p-4 mb-8 rounded-xl">
          <View className="flex flex-row items-center">
            <Text className="flex flex-1 text-white font-semibold text-xl">Haptic Feedback</Text>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>
          <Text className="flex flex-1 text-gray-400 font-medium text-sm">
            Toggle haptic feedback effect on the bottom tab bar.
          </Text>
        </View>
        <Text className="text-white text-2xl font-bold py-3">About</Text>
        <View className="bg-gray-300 gap-4 dark:bg-[#1f2937] p-4 rounded-xl">
          <Text className="flex flex-1 text-white font-medium text-md">
            Note: PaceMan.gg is a community run real-time speedrun tracker. PaceMan.gg is not affiliated or endorsed by
            "Minecraft" or "Mojang".
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;
