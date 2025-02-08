import TwitchButton from "@/components/TwitchButton";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import { forwardRef, useMemo } from "react";
import { useBottomTabBarHeight } from "react-native-bottom-tabs";
import { View, Text, TouchableOpacity } from "react-native";
import { msToTime, getSortedEventsWithTimes } from "@/lib/utils/frontendConverters";
import BottomSheet, { BottomSheetView, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

interface PaceBottomSheetProps {
  selected: string | null;
  params: any;
  onBackdropPress: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.ReactElement;
  onSheetChanges: (index: number) => void;
}

const PaceBottomSheet = forwardRef<BottomSheet, PaceBottomSheetProps>(
  ({ selected, params, renderBackdrop, onSheetChanges }, ref) => {
    const router = useRouter();
    const bottomTabBarHeight = useBottomTabBarHeight();
    const { data: liveruns } = useLiverunsData(params);
    const selectedPace = liveruns?.find((liveruns) => liveruns.worldId === selected);

    const splits = useMemo(() => {
      if (!selectedPace) return [];
      const completedEvents = new Map(selectedPace.eventList.map((event) => [event.name, event.time]));
      return getSortedEventsWithTimes(completedEvents);
    }, [selectedPace]);

    if (!selectedPace) return null;

    return (
      <BottomSheet
        index={0}
        ref={ref}
        enablePanDownToClose
        enableOverDrag={false}
        enableHandlePanningGesture
        handleComponent={null}
        backgroundComponent={null}
        backdropComponent={renderBackdrop}
        onChange={onSheetChanges}
      >
        <BottomSheetView
          style={{ paddingBottom: bottomTabBarHeight }}
          className="flex flex-1 px-4 bg-white dark:bg-[#1f2937] rounded-t-2xl"
        >
          {/* PLAYER AVATAR + NAME + TWITCH BUTTON */}
          <View className="flex flex-row items-center justify-between pt-8 gap-2">
            <TouchableOpacity
              className="flex flex-row items-center gap-2"
              activeOpacity={0.5}
              onPress={() => router.push(`/stats/player/${selectedPace.nickname}`)}
            >
              <Image
                className="w-12 h-12"
                source={{ uri: `https://mc-heads.net/avatar/${selectedPace.uuid}` }}
                style={{ height: 50, width: 50 }}
              />
              <Text numberOfLines={1} className="flex text-black dark:text-white text-2xl font-bold">
                {selectedPace.nickname}
              </Text>
            </TouchableOpacity>
            {selectedPace.twitch && <TwitchButton href={selectedPace.twitch} />}
          </View>

          {/* CURRENT PACE SPLIT */}
          <View className="flex flex-row items-center my-6 gap-2">
            <Text className="flex flex-1 text-black dark:text-white text-4xl font-bold">{selectedPace.splitName}</Text>
            <Text className="text-black dark:text-white text-4xl font-bold">{msToTime(selectedPace.time)}</Text>
          </View>

          {/* ALL SPLITS */}
          {splits.map((event, index) => {
            const { splitName, splitTime } = event;
            const isCompleted = splitTime !== "N/A";

            return (
              <View key={index} className="flex flex-row items-center mb-3">
                <Text
                  className={`flex flex-1 ${
                    isCompleted ? "text-black dark:text-[#ECEDEE]" : "text-[#A0A0A0] dark:text-[#6B7280]"
                  } text-lg`}
                >
                  {splitName}
                </Text>
                <Text
                  className={`${
                    isCompleted ? "text-black dark:text-[#ECEDEE]" : "text-[#A0A0A0] dark:text-[#6B7280]"
                  } text-lg`}
                >
                  {isCompleted ? msToTime(splitTime) : "--:--"}
                </Text>
              </View>
            );
          })}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default PaceBottomSheet;
