import { Image } from "expo-image";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

const PacePage = () => {
  const { uuid, nickname } = useLocalSearchParams<{ uuid: string; nickname: string }>();

  return (
    <ScrollView className="flex flex-1 px-4 bg-white dark:bg-[#111827]">
      {/* USERNAME + TWITCH/OFFLINE BUTTON */}
      <View className="flex flex-row items-center justify-between py-8 gap-2">
        <Image
          className="w-12 h-12"
          source={{ uri: `https://mc-heads.net/avatar/${uuid}` }}
          style={{ height: 50, width: 50 }}
        />
        <Text className="flex flex-1 text-black dark:text-white text-2xl font-bold">{nickname}</Text>
      </View>
    </ScrollView>
  );
};

export default PacePage;
