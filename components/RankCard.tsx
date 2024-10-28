import { View, Text, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { getRankColor } from "@/lib/utils/frontendConverters";
interface RankCardProps {
  index: number;
  uuid: string;
  nickname: string;
  score: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const RankCard = ({ index, uuid, nickname, score }: RankCardProps) => {
  // This did not work for some reason when defining it in "@/lib/utils/frontendConverters". Not the end of the world but silly.
  // const getRankColor = (index: number) => {
  //   return index === 0
  //     ? `text-rank-gold`
  //     : index === 1
  //     ? `text-rank-silver`
  //     : index === 2
  //     ? `text-rank-bronze`
  //     : `text-black dark:text-white`;
  // };

  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: `/(tabs)/stats/player/[id]`,
      params: {
        id: nickname,
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
        <Text className={`text-xl font-bold ${getRankColor(index)}`}>{index + 1}</Text>
      </View>

      <Image
        source={`https://mc-heads.net/avatar/${uuid}`}
        style={{ height: 35, width: 35 }}
        placeholder={require("@/assets/images/steve.png")}
      />
      <Text className={`flex flex-1 text-xl font-bold ${getRankColor(index)}`}>{nickname}</Text>
      <Text className={`text-xl font-bold ${getRankColor(index)}`}>{msToTime(score)}</Text>
    </AnimatedPressable>
  );
};

export default RankCard;
