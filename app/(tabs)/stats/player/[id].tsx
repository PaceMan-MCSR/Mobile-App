
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const PacePage = () => {
  const {id} = useLocalSearchParams<{id: string}>();

  return (
    <ScrollView className="flex flex-1 px-4 bg-white dark:bg-[#111827]">
      <View className="flex flex-row items-center justify-between py-8 gap-2">
        <Text className="flex flex-1 text-black dark:text-white text-2xl font-bold">{id}</Text>
      </View>
    </ScrollView>
  );
};

export default PacePage;
