import { Pressable, ScrollView, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

const LeaderboardPage = () => {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex flex-1 items-center justify-center gap-4 bg-white dark:bg-black">
        <Pressable onPress={() => setColorScheme("light")}>
          <Text className="text-black dark:text-white text-2xl">Light</Text>
        </Pressable>
        <Pressable onPress={() => setColorScheme("dark")}>
          <Text className="text-black dark:text-white text-2xl">Dark</Text>
        </Pressable>
        <Pressable onPress={() => setColorScheme("system")}>
          <Text className="text-black dark:text-white text-2xl">System</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default LeaderboardPage;
