import TwitchButton from "@/components/TwitchButton";
import PaceEndedScreen from "@/components/PaceEndedScreen";
import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";

const PacePage = () => {
  const { id: worldId } = useLocalSearchParams();
  const { data: liveruns } = useLiverunsData();
  const fetchedPace = liveruns.find((pace: Pace) => pace.worldId === worldId);

  if (!fetchedPace) return <PaceEndedScreen />;

  return (
    <ScrollView className="flex flex-1 px-4 bg-white dark:bg-[#111827]">
      {/* USERNAME + TWITCH/OFFLINE BUTTON */}
      <View className="flex flex-row items-center justify-between py-8 gap-2">
        <Image
          className="w-12 h-12"
          source={{ uri: `https://mc-heads.net/avatar/${fetchedPace.user.uuid}` }}
          style={{ height: 50, width: 50 }}
        />
        <Text className="flex flex-1 text-black dark:text-white text-2xl font-bold">{fetchedPace.nickname}</Text>
        <TwitchButton href={fetchedPace.user.liveAccount} />
      </View>
      {fetchedPace?.eventList
        .slice()
        .reverse()
        .map((event: { eventId: string; rta: number; igt: number }, index: number) => (
          <View key={index} className="flex flex-row items-center my-2 gap-2">
            {/* EVENT LIST ITEM NAME */}
            <Text
              className={`flex flex-1 text-black dark:text-white ${index === 0 ? `text-4xl` : `text-lg`}`}
              key={index}
            >
              {EVENT_ID_NAME[fetchedPace.eventList.length - 1 - index]}
            </Text>
            {/* EVENT LIST ITEM IGT */}
            <Text className={`text-black dark:text-white ${index === 0 ? `text-4xl` : `text-lg`}`}>
              {msToTime(event.igt)}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
};

export default PacePage;
