import TwitchButton from "@/components/twitch-button";
import { useLiverunsData } from "@/hooks/api/use-liveruns-data";
import { useBottomSheetBackHandler } from "@/hooks/use-bottom-sheet-back-handler";
import { getSortedEventsWithTimes, msToTime } from "@/lib/utils/frontend-converters";
import BottomSheet, { BottomSheetBackdropProps, BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { forwardRef, useCallback, useMemo } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useBottomTabBarHeight } from "react-native-bottom-tabs";

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

    // Use the back handler hook
    const { handleSheetPositionChange } = useBottomSheetBackHandler(ref as React.RefObject<BottomSheet | null>);

    // Combine the existing onSheetChanges with the back handler
    const handleSheetChange = useCallback(
      (index: number) => {
        handleSheetPositionChange(index);
        onSheetChanges(index);
      },
      [handleSheetPositionChange, onSheetChanges]
    );

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
        onChange={handleSheetChange}
      >
        <BottomSheetView
          style={{ paddingBottom: Platform.select({ ios: bottomTabBarHeight, android: 0 }) }}
          className="flex flex-1 rounded-t-2xl bg-white px-4 dark:bg-[#1f2937]"
        >
          {/* PLAYER AVATAR + NAME + TWITCH BUTTON */}
          <View className="flex flex-row items-center justify-between gap-2 pt-8">
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
          <View className="my-6 flex flex-row items-center gap-2">
            <Text className="flex flex-1 text-4xl font-bold text-black dark:text-white">{selectedPace.splitName}</Text>
            <Text className="text-4xl font-bold text-black dark:text-white">{msToTime(selectedPace.time)}</Text>
          </View>

          {/* ALL SPLITS */}
          {splits.map((event, index) => {
            const { splitName, splitTime } = event;
            const isCompleted = splitTime !== "N/A";

            return (
              <View key={index} className="mb-3 flex flex-row items-center">
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

PaceBottomSheet.displayName = "PaceBottomSheet";

export default PaceBottomSheet;
