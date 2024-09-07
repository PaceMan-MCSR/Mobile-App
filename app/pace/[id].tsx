import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import TwitchButton from "@/components/TwitchButton";

const PacePage = () => {
  const { id } = useLocalSearchParams();
  const { data: liveruns } = useLiverunsData();
  const fetchedPace = liveruns.find((pace: Pace) => pace.worldId === id);

  return (
    <ScrollView className="flex flex-1 px-4 bg-white dark:bg-[#111827]">
      <View className="flex flex-row py-8 gap-2 items-center justify-between">
        <Image
          className="w-12 h-12"
          source={{ uri: `https://mc-heads.net/avatar/${fetchedPace.user.uuid}` }}
          style={{ height: 50, width: 50 }}
        />
        <Text className="flex flex-1 text-black dark:text-white font-bold text-2xl">{fetchedPace.nickname}</Text>
        <TwitchButton href={fetchedPace.user.liveAccount} />
      </View>
      {fetchedPace?.eventList
        .slice()
        .reverse()
        .map((event: { eventId: string; rta: number; igt: number }, index: number) => (
          <View key={index} className="flex flex-row items-center gap-2 my-2">
            <Text
              className={`flex flex-1 text-black dark:text-white ${index === 0 ? `text-2xl` : `text-lg`}`}
              key={index}
            >
              {EVENT_ID_NAME[fetchedPace.eventList.length - 1 - index]}
            </Text>
            <Text className={`text-black dark:text-white ${index === 0 ? `text-2xl` : `text-lg`}`}>
              {msToTime(event.igt)}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
};

export default PacePage;
