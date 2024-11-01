import React, { forwardRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import TwitchButton from "@/components/TwitchButton";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import { Pace } from "@/lib/types/Pace";
import { EVENT_ID_NAME } from "@/lib/utils/frontendConverters";

interface PaceBottomSheetProps {
  selectedPace: Pace | null;
  onBackdropPress: () => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.ReactElement;
  onSheetChanges: (index: number) => void;
}

const PaceBottomSheet = forwardRef<BottomSheet, PaceBottomSheetProps>(
  ({ selectedPace, renderBackdrop, onSheetChanges }, ref) => {
    if (!selectedPace) return null;
    const completedEvents = new Map(selectedPace.eventList.map((event) => [event.name, event.time]));

    return (
      <BottomSheet
        ref={ref}
        handleComponent={null}
        index={0}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
        onChange={onSheetChanges}
      >
        <BottomSheetView className="flex flex-1 px-4 bg-white dark:bg-[#1f2937] rounded-t-2xl">
          {/* PLAYER AVATAR + NAME + TWITCH BUTTON */}
          <View className="flex flex-row items-center justify-between pt-8 gap-2">
            <Image
              className="w-12 h-12"
              source={{ uri: `https://mc-heads.net/avatar/${selectedPace.uuid}` }}
              style={{ height: 50, width: 50 }}
            />
            <Text className="flex flex-1 text-black dark:text-white text-2xl font-bold">{selectedPace.nickname}</Text>
            <TwitchButton href={selectedPace.twitch} />
          </View>

          {/* CURRENT PACE SPLIT */}
          <View className="flex flex-row items-center my-6 gap-2">
            <Text className="flex flex-1 text-black dark:text-white text-4xl font-bold">{selectedPace.splitName}</Text>
            <Text className="text-black dark:text-white text-4xl font-bold">{msToTime(selectedPace.time)}</Text>
          </View>

          {/* ALL SPLITS */}
          {EVENT_ID_NAME.map((splitName, index) => {
            const splitTime = completedEvents.get(splitName);
            const isCompleted = splitTime !== undefined;

            // Special handling for structure entry (Bastion/Fortress)
            if (
              (splitName === "Enter Bastion" || splitName === "Enter Fortress") &&
              !completedEvents.has("Enter Bastion") &&
              !completedEvents.has("Enter Fortress")
            ) {
              const structureNumber = splitName === "Enter Bastion" ? "1" : "2";
              return (
                <View key={index} className="flex flex-row items-center mb-3">
                  <Text className="flex flex-1 text-gray-500 text-lg">Enter Structure {structureNumber}</Text>
                  <Text className="text-gray-500 text-lg">--:--</Text>
                </View>
              );
            }

            return (
              <View key={index} className="flex flex-row items-center mb-3">
                <Text className={`flex flex-1 ${isCompleted ? "text-black dark:text-white" : "text-gray-500"} text-lg`}>
                  {splitName}
                </Text>
                <Text className={`${isCompleted ? "text-black dark:text-white" : "text-gray-500"} text-lg`}>
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
