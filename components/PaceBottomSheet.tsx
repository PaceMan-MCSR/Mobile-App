import React, { useCallback, useRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import TwitchButton from "@/components/TwitchButton";
import { Image } from "expo-image";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";
import { Pace } from "@/lib/types/Pace";

interface PaceBottomSheetProps {
  selectedPace: Pace | null;
  onBackdropPress: () => void;
}

const PaceBottomSheet = ({ selectedPace, onBackdropPress }: PaceBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  // Backdrop Component: Tinted Black Background
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={"close"}
        onPress={onBackdropPress}
        opacity={0.5}
      />
    ),
    [onBackdropPress]
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onBackdropPress();
      }
    },
    [onBackdropPress]
  );

  if (!selectedPace) return null;

  return (
    <BottomSheet
      handleComponent={null}
      index={selectedPace ? 0 : -1}
      enablePanDownToClose
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
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
};

export default PaceBottomSheet;
