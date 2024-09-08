import { Text, View } from "react-native";
import React from "react";

const PaceEndedScreen = () => {
  return (
    <View className="flex flex-1 items-center justify-center px-3 gap-2 bg-white dark:bg-[#111827]">
      <Text className="text-black dark:text-white text-xl">Pace Not Found...</Text>
      <Text className="text-black dark:text-white text-lg text-center">
        Looks like the runner has reset the run, or the run has finished.
      </Text>
    </View>
  );
};

export default PaceEndedScreen;
