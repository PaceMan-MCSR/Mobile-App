import TwitchButton from "@/components/twitch-button";
import { Pace } from "@/lib/types/Pace";
import { getSortedEventsWithTimes, msToTime } from "@/lib/utils/frontend-converters";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";

export default function PaceBottomSheetContent({
  selectedPace,
  onLayout,
}: {
  selectedPace: Pace;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  const router = useRouter();
  const splits = getSortedEventsWithTimes(
    new Map<string, number>(selectedPace.eventList.map((event) => [event.name, event.time]))
  );

  return (
    <View onLayout={onLayout} className="w-full px-4 pb-8 pt-7" style={{ width: "100%" }}>
      {/* PLAYER AVATAR + NAME + TWITCH BUTTON */}
      <View className="flex flex-row items-center justify-between gap-2">
        <TouchableOpacity
          className="flex flex-row items-center gap-2"
          activeOpacity={0.5}
          onPress={() => router.push(`/stats/player/${selectedPace.nickname}`)}
        >
          <Image
            className="h-12 w-12"
            source={{ uri: `https://mc-heads.net/avatar/${selectedPace.uuid}` }}
            style={{ height: 50, width: 50 }}
          />
          <Text numberOfLines={1} className="flex text-2xl font-bold text-black dark:text-white">
            {selectedPace.nickname}
          </Text>
        </TouchableOpacity>
        <TwitchButton twitch={selectedPace.twitch} />
      </View>

      {/* CURRENT PACE SPLIT */}
      <View className="my-6 flex flex-row items-center" style={{ width: "100%" }}>
        <Text
          numberOfLines={2}
          className="text-4xl font-bold text-black dark:text-white"
          style={{ width: "60%", flexShrink: 1 }}
        >
          {selectedPace.splitName}
        </Text>
        <Text
          className="text-right text-4xl font-bold text-black dark:text-white"
          style={{ width: "40%", flexShrink: 0 }}
        >
          {msToTime(selectedPace.time)}
        </Text>
      </View>

      {/* ALL SPLITS */}
      {splits.map((event, index) => {
        const { splitName, splitTime } = event;
        const isCompleted = splitTime !== "N/A";
        const textClassName = isCompleted ? "text-black dark:text-[#ECEDEE]" : "text-[#A0A0A0] dark:text-[#6B7280]";

        return (
          <View key={index} className="mb-3 flex flex-row items-center" style={{ width: "100%" }}>
            <Text className={`text-lg ${textClassName}`} style={{ width: "65%" }}>
              {splitName}
            </Text>
            <Text className={`text-right text-lg ${textClassName}`} style={{ width: "35%" }}>
              {isCompleted ? msToTime(splitTime) : "--:--"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
