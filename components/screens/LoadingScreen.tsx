import { ActivityIndicator, Text, View } from "react-native";

const loadingMessages = [
  "Finding 9 9",
  "Collecting 3 bread from the blacksmith",
  "Collecting 3 iron from the golem",
  "Collecting 3 emeralds from the ship",
  "Spawning into basalt",
  "Routing the double bad triple single",
  "Getting negative pearl trades",
  "Piedar-ing into a treasure",
  "Leaving on 19 obby",
  "Spawning in the middle of two strongholds",
  "Navigating the 27 room stronghold",
  "Entering into a zero eye",
  "Zero-cycling with 3 Beds",
];

const LoadingScreen = () => {
  return (
    <View className="flex flex-1 items-center justify-center gap-2 bg-[#F2F2F2] dark:bg-[#111827]">
      <ActivityIndicator className="color-black dark:color-white" />
      <Text className="text-lg text-black dark:text-white">
        {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}...
      </Text>
    </View>
  );
};

export default LoadingScreen;
