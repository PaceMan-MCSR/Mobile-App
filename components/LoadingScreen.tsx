import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

const LoadingScreen = () => {
  return (
    <View className="flex flex-1 items-center justify-center gap-2 bg-white dark:bg-black">
      <Text className="text-black dark:text-white">Routing some bastions...</Text>
    </View>
  );
};

export default LoadingScreen;
