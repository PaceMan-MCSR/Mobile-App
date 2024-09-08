import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

const loadingMessagesArray = [
  "Finding 9 9...",
  "Routing the double bad triple single...",
  "Piedar-ing into a Treasure...",
  "Leaving on 19 Obby...",
  "Zero Cycling with 3 beds...",
];

const LoadingScreen = () => {
  return (
    <View className="flex flex-1 items-center justify-center gap-2 bg-white dark:bg-[#111827]">
      <ActivityIndicator className="color-black dark:color-white" />
      <Text className="text-black dark:text-white text-lg">
        {loadingMessagesArray[Math.floor(Math.random() * loadingMessagesArray.length)]}
      </Text>
    </View>
  );
};

export default LoadingScreen;
