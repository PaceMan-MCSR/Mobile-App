import React, { useCallback, useRef } from "react";
import { View, Text } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import TwitchButton from "@/components/TwitchButton";
import { Pace } from "@/lib/types/Pace";
import { Image } from "expo-image";
import { EVENT_ID_NAME, msToTime } from "@/lib/utils/frontendConverters";

const PaceBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const fetchedPace = {
    worldId: "9b5c58357d742a3cdd23a3334cf5c504b52cf30326ce4d469c894402e07c4b12",
    gameVersion: "1.16.1",
    eventList: [
      { eventId: "rsg.enter_nether", rta: 208984, igt: 208200 },
      { eventId: "rsg.enter_bastion", rta: 335195, igt: 323501 },
      { eventId: "rsg.enter_fortress", rta: 574645, igt: 561167 },
      // { eventId: "rsg.first_portal", rta: 747268, igt: 733567 },
    ],
    contextEventList: [
      { eventId: "rsg.obtain_iron_ingot", rta: 55695, igt: 55150 },
      { eventId: "rsg.obtain_iron_pickaxe", rta: 176897, igt: 176350 },
      { eventId: "rsg.obtain_lava_bucket", rta: 198195, igt: 197650 },
      { eventId: "rsg.loot_bastion", rta: 341996, igt: 330301 },
      { eventId: "rsg.obtain_crying_obsidian", rta: 343950, igt: 332251 },
      { eventId: "rsg.obtain_obsidian", rta: 445493, igt: 433801 },
      { eventId: "rsg.obtain_blaze_rod", rta: 589594, igt: 576117 },
    ],
    user: { uuid: "4129d8d1-aafb-4e73-b97b-9999db248060", liveAccount: null },
    isCheated: false,
    isHidden: false,
    lastUpdated: 1724947725702,
    nickname: "CroProYT",
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet index={0} enablePanDownToClose ref={bottomSheetRef} onChange={handleSheetChanges}>
      <BottomSheetView className="flex flex-1 px-4 bg-white dark:bg-[#111827]">
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
      </BottomSheetView>
    </BottomSheet>
  );
};

export default PaceBottomSheet;
