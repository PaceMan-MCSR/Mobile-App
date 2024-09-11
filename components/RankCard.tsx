import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import { useRouter } from "expo-router";
import Animated, { BounceInUp, FadeIn, FadeInDown, FadeInUp, withDelay } from "react-native-reanimated";

interface RankCardProps {
  index: number;
  uuid: string;
  nickname: string;
  score: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RankCard = ({ index, uuid, nickname, score }: RankCardProps) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: `/(tabs)/stats/player/[id]`,
      params: {
        id: nickname,
        uuid: uuid,
        nickname: nickname,
      },
    });
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(10 * index).springify()}
      className="flex flex-row w-full items-center px-4 py-4 gap-3"
      onPress={handlePress}
    >
      <View className="min-w-10 flex">
        <Text className="text-xl font-bold text-black dark:text-white">{index + 1}</Text>
      </View>

      <Image source={`https://mc-heads.net/avatar/${uuid}`} style={{ height: 35, width: 35 }} />
      <Text className="flex flex-1 text-xl font-bold text-black dark:text-white">{nickname}</Text>
      <Text className="text-xl font-bold text-black dark:text-white">{msToTime(score)}</Text>
    </AnimatedPressable>
  );
};

export default RankCard;
