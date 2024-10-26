// PaceBottomSheet.tsx
import React, { forwardRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import TwitchButton from "@/components/TwitchButton";
import { Image } from "expo-image";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";
import { Pace } from "@/lib/types/Pace";

interface PaceBottomSheetProps {
  selectedPace: Pace | null;
  onBackdropPress: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.ReactElement;
  onSheetChanges: (index: number) => void;
}

const PaceBottomSheet = forwardRef<BottomSheet, PaceBottomSheetProps>(
  ({ selectedPace, renderBackdrop, onSheetChanges }, ref) => {
    if (!selectedPace) return null;

    return (
      <BottomSheet
        ref={ref}
        handleComponent={null}
        index={0}
        // snapPoints={["60%"]}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
        onChange={onSheetChanges}
      >
        <BottomSheetView className="flex flex-1 px-4 bg-white dark:bg-[#1f2937] rounded-t-2xl">
          <View className="flex flex-row items-center justify-between py-8 gap-2">
            <Image
              className="w-12 h-12"
              source={{ uri: `https://mc-heads.net/avatar/${selectedPace.user.uuid}` }}
              style={{ height: 50, width: 50 }}
            />
            <Text className="flex flex-1 text-black dark:text-white text-2xl font-bold">{selectedPace.nickname}</Text>
            <TwitchButton href={selectedPace.user.liveAccount} />
          </View>
          {selectedPace.eventList
            .slice()
            .reverse()
            .map((event: { eventId: string; rta: number; igt: number }, index: number) => (
              <View key={index} className="flex flex-row items-center my-2 gap-2">
                <Text className={`flex flex-1 text-black dark:text-white ${index === 0 ? "text-4xl" : "text-lg"}`}>
                  {EVENT_ID_NAME[selectedPace.eventList.length - 1 - index]}
                </Text>
                <Text className={`text-black dark:text-white ${index === 0 ? "text-4xl" : "text-lg"}`}>
                  {msToTime(event.igt)}
                </Text>
              </View>
            ))}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default PaceBottomSheet;
