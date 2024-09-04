import { View, Text } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";
import { useLiverunsData } from "@/hooks/useLiverunsData";

const PacePage = () => {
  const { id } = useLocalSearchParams();
  const { data: liveruns } = useLiverunsData();
  const fetchedPace = liveruns.find((pace: Pace) => pace.worldId === id);
  return (
    <View>
      {fetchedPace.user.liveAccount && (
        <Link href={`https://twitch.tv/${fetchedPace.user.liveAccount}`}>
          <Text className="text-blue-500 dark:text-blue-500 underline">
            https://twitch.tv/{fetchedPace.user.liveAccount}
          </Text>
        </Link>
      )}
      <Text className="text-black dark:text-white">World ID: {fetchedPace?.worldId}</Text>
      <Text className="text-black dark:text-white">Game Version: {fetchedPace?.gameVersion}</Text>
      <Text className="text-black dark:text-white">Nickname: {fetchedPace?.nickname}</Text>
      <Text className="text-black dark:text-white">
        Last Updated: {new Date(fetchedPace?.lastUpdated).toLocaleString()}
      </Text>
      <Text className="text-black dark:text-white">Is Cheated: {fetchedPace?.isCheated ? "Yes" : "No"}</Text>
      <Text className="text-black dark:text-white">Is Hidden: {fetchedPace?.isHidden ? "Yes" : "No"}</Text>

      <Text className="text-black dark:text-white mt-3">Event List:</Text>
      {fetchedPace?.eventList
        .slice()
        .reverse()
        .map((event: { eventId: string; rta: number; igt: number }, index: number) => (
          <Text className="text-black dark:text-white" key={index}>
            {EVENT_ID_NAME[fetchedPace.eventList.length - 1 - index]} - RTA: {msToTime(event.rta)}, IGT:{" "}
            {msToTime(event.igt)}
          </Text>
        ))}

      <Text className="text-black dark:text-white mt-2">Context Event List:</Text>
      {fetchedPace?.contextEventList
        .slice()
        .reverse()
        .map((event: { eventId: string; rta: number; igt: number }, index: number) => (
          <Text className="text-black dark:text-white" key={index}>
            {EVENT_ID_NAME[fetchedPace.contextEventList.length - 1 - index]} - RTA: {msToTime(event.rta)}, IGT:{" "}
            {msToTime(event.igt)}
          </Text>
        ))}
    </View>
  );
};

export default PacePage;
