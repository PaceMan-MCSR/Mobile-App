import React, { useEffect, useRef } from "react";
import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { EVENT_ID_NAME, msToTime, splitToIcon } from "@/lib/utils/frontendConverters";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

interface PaceCardProps extends Pace {
  index: number;
}

const PaceCard = (props: PaceCardProps) => {
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  const router = useRouter();
  const splitTime = msToTime(props.lastUpdated);
  const currentEvent = EVENT_ID_NAME[props.eventList.length - 1];
  const handlePress = () => {
    router.push({
      pathname: `/pace/${props.worldId}`,
      params: { nickname: props.nickname, liveAccount: props.user.liveAccount },
    });
  };
  const handleLongPress = () => {
    console.log("peepoPauseMan");
  };
  const initialMode = useRef<boolean>(true);

  useEffect(() => {
    initialMode.current = false;
  }, []);

  return (
    <AnimatedTouchableOpacity
      className="w-full h-28 rounded-2xl bg-[#1f2937] flex-row items-center px-4 gap-4 my-2"
      activeOpacity={0.75}
      entering={initialMode.current ? FadeIn.delay(100 * props.index) : FadeIn}
      exiting={FadeOut}
      layout={LinearTransition}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      {/* MINECRAFT SKIN AVATAR */}
      <View>
        <Image
          className="w-12 h-12"
          source={`https://mc-heads.net/avatar/${props.user.uuid}`}
          style={{ height: 50, width: 50 }}
        />
      </View>
      {/* USERNAME + CURRENT SPLIT */}
      <View className="flex flex-1">
        <Text className="text-black dark:text-white font-bold text-2xl">{props.nickname}</Text>
        <View className="flex flex-row items-start gap-1">
          <Image source={splitToIcon(props.eventList.length - 1)} style={{ width: 15, height: 15 }} />
          <Text className="text-black dark:text-white">{currentEvent}</Text>
        </View>
      </View>
      {/* LAST UPDATED */}
      <Text className="text-black dark:text-white text-4xl font-bold">{splitTime}</Text>
    </AnimatedTouchableOpacity>
  );
};
export default PaceCard;
