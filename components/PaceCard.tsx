import React from "react";
import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";

const PaceCard = (props: Pace) => {
  const router = useRouter();
  const splitTime = msToTime(props.lastUpdated);
  const currentEvent = EVENT_ID_NAME[props.eventList.length - 1];
  const handlePress = () => {
    router.push({
      pathname: `/pace/[id]`,
      params: {
        id: props.worldId,
        eventList: JSON.stringify(props.eventList),
        nickname: props.nickname,
        lastUpdated: props.lastUpdated,
      },
    });
  };
  const handleLongPress = () => {
    console.log("peepoPauseMan");
  };

  return (
    <TouchableOpacity
      className="w-full h-28 rounded-2xl border border-red-500 flex-row items-center px-4 gap-4 my-2"
      activeOpacity={0.75}
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
        <Text className="text-black dark:text-white">{currentEvent}</Text>
      </View>
      {/* LAST UPDATED */}
      <Text className="text-black dark:text-white text-4xl font-bold">{splitTime}</Text>
    </TouchableOpacity>
  );
};
export default PaceCard;
