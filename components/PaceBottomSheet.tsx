// PaceBottomSheet.tsx
import React, { forwardRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import TwitchButton from "@/components/TwitchButton";
import { Image } from "expo-image";
import { EVENT_ID_NAME, msToTime, eventIdToName, getMostRecentSplit } from "@/lib/utils/frontendConverters";
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
    const eventMap = new Map(selectedPace.eventList.map((event) => [event.eventId, event]));
    const enterBastion = eventMap.has("rsg.enter_bastion");
    const enterFortress = eventMap.has("rsg.enter_fortress");

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
              source={{ uri: `https://mc-heads.net/avatar/${selectedPace.user.uuid}` }}
              style={{ height: 50, width: 50 }}
            />
            <Text className="flex flex-1 text-black dark:text-white text-2xl font-bold">{selectedPace.nickname}</Text>
            <TwitchButton href={selectedPace.user.liveAccount} />
          </View>

          {/* CURRENT PACE SPLIT */}
          <View className="flex flex-row items-center my-6 gap-2">
            <Text className="flex flex-1 text-black dark:text-white text-4xl font-bold">
              {getMostRecentSplit(selectedPace.eventList).eventName}
            </Text>
            <Text className="text-black dark:text-white text-4xl font-bold">
              {getMostRecentSplit(selectedPace.eventList).igt}
            </Text>
          </View>
          {/* ALL SPLITS - ACHIEVED */}
          {selectedPace.eventList.map((event, index) => (
            <View key={index} className="flex flex-row items-center my-2 gap-2">
              <Text className="flex flex-1 text-black dark:text-white text-lg">
                {eventIdToName.get(event.eventId) || event.eventId}
              </Text>
              <Text className="text-black dark:text-white text-lg">{msToTime(event.igt)}</Text>
            </View>
          ))}
          {Array.from(eventIdToName.entries()).map(([eventId, eventName], index) => {
            if (!eventMap.has(eventId)) {
              if (eventId === "rsg.enter_bastion" && !enterBastion && !enterFortress) {
                return (
                  <View key={index} className="flex flex-row items-center mb-3">
                    <Text className="flex flex-1 text-gray-500 text-lg">Enter Structure 1</Text>
                    <Text className="text-gray-500 text-lg">--:--</Text>
                  </View>
                );
              }
              if (eventId === "rsg.enter_fortress" && !enterBastion && !enterFortress) {
                return (
                  <View key={index} className="flex flex-row items-center mb-3">
                    <Text className="flex flex-1 text-gray-500 text-lg">Enter Structure 2</Text>
                    <Text className="text-gray-500 text-lg">--:--</Text>
                  </View>
                );
              }
              return (
                <View key={index} className="flex flex-row items-center mb-3">
                  <Text className="flex flex-1 text-gray-500 text-lg">{eventName}</Text>
                  <Text className="text-gray-500 text-lg">--:--</Text>
                </View>
              );
            }
            return null;
          })}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default PaceBottomSheet;
