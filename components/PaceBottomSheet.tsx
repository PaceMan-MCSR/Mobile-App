import React, { forwardRef, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import BottomSheetModal, { BottomSheetView, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import TwitchButton from "@/components/TwitchButton";
import { Image } from "expo-image";
import { msToTime, getSortedEventsWithTimes } from "@/lib/utils/frontendConverters";
import { Pace } from "@/lib/types/Pace";
import { useBottomTabBarHeight } from "react-native-bottom-tabs";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import BottomSheet from "@gorhom/bottom-sheet";

interface PaceBottomSheetProps {
  selected: string | null;
  params: any;
  onBackdropPress: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.ReactElement;
  onSheetChanges: (index: number) => void;
}

const PaceBottomSheet = forwardRef<BottomSheet, PaceBottomSheetProps>(
  ({ selected, params, renderBackdrop, onSheetChanges }, ref) => {
    const bottomTabBarHeight = useBottomTabBarHeight();
    const { data: liveruns, isLoading } = useLiverunsData(params);
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
            <Image
              className="w-12 h-12"
              source={{ uri: `https://mc-heads.net/avatar/${selectedPace.uuid}` }}
              style={{ height: 50, width: 50 }}
            />
            <Text numberOfLines={1} className="flex flex-1 text-black dark:text-white text-2xl font-bold">
              {selectedPace.nickname}
            </Text>
            <TwitchButton href={selectedPace.twitch} />
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
                <Text className={`flex flex-1 ${isCompleted ? "text-text-primary" : "text-text-secondary"} text-lg`}>
                  {splitName}
                </Text>
                <Text className={`${isCompleted ? "text-text-primary" : "text-text-secondary"} text-lg`}>
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
