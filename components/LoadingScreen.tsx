import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

const loadingMessagesArray = [
  "Finding 9 9...",
  "Looting 3 Bread from the BlackSmith...",
  "Collecting 3 Iron from the Golem...",
  "Collecting 3 Emeralds from the Ship...",
  "Spawning into Basalt...",
  "Routing the Double Bad Triple Single...",
  "Getting negative pearl trades...",
  "Piedar-ing into a Treasure...",
  "Leaving on 19 Obby...",
  "Spawning in the middle of two strongholds...",
  "Navigating the 27 room stronghold...",
  "Entering into a zero eye...",
  "Zero Cycling with 3 Beds...",
];

const LoadingScreen = () => {
  return (
    <View className="flex flex-1 items-center justify-center gap-2 bg-background-primary">
      <ActivityIndicator className="color-black dark:color-white" />
      <Text className="text-black dark:text-white text-lg">
        {loadingMessagesArray[Math.floor(Math.random() * loadingMessagesArray.length)]}
      </Text>
    </View>
  );
};

export default LoadingScreen;
