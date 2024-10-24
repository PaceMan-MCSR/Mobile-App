/* 
TODO: 
- Fix redundancy of props
- Fix redundancy of same component being called thrice. 
- Code Cleanup
*/

import PaceCard from "@/components/PaceCard";
import LoadingScreen from "@/components/LoadingScreen";
import { Pace } from "@/lib/types/Pace";
import { FlatList, Text, View } from "react-native";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import PaceBottomSheet from "@/components/PaceBottomSheet";
import { useState } from "react";
import HomeRightComponent from "@/components/HomeRightComponent";
import { Tabs } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";

const HomePage = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [params, setParams] = useState({
    gameVersion: "1.16.1",
    liveOnly: false,
  });

  const { data: liveruns, isLoading } = useLiverunsData(params);
  const [selectedPace, setSelectedPace] = useState<Pace | null>(null);

  const handleLiveOnlyToggle = () => {
    setParams((prevParams) => ({
      ...prevParams,
      liveOnly: !prevParams.liveOnly,
    }));
  };

  const handleGameVersionSelect = () => {
    const versions = ["1.16.1", "1.15.2", "1.7.10", "1.8.9", "1.14.4", "1.12.2", "1.16.5", "1.17.1"];
    showActionSheetWithOptions(
      {
        options: [...versions, "Cancel"],
        cancelButtonIndex: versions.length,
        title: "Select a Minecraft version",
      },
      (buttonIndex) => {
        if (buttonIndex !== undefined && buttonIndex < versions.length) {
          setParams((prevParams) => ({
            ...prevParams,
            gameVersion: versions[buttonIndex],
          }));
        }
      }
    );
  };

  if (isLoading)
    return (
      <>
        <Tabs.Screen
          options={{
            headerRight: () => (
              <HomeRightComponent
                liveOnly={params.liveOnly}
                onGameVersionSelect={handleGameVersionSelect}
                onLiveOnlyToggle={handleLiveOnlyToggle}
              />
            ),
          }}
        />
        <LoadingScreen />
      </>
    );

  if (!liveruns.length)
    return (
      <>
        <Tabs.Screen
          options={{
            headerRight: () => (
              <HomeRightComponent
                liveOnly={params.liveOnly}
                onGameVersionSelect={handleGameVersionSelect}
                onLiveOnlyToggle={handleLiveOnlyToggle}
              />
            ),
          }}
        />
        <View className="flex flex-1 items-center justify-center bg-white dark:bg-[#111827]">
          <Text className="text-black dark:text-white text-lg">No one is currently on pace...</Text>
        </View>
      </>
    );

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <HomeRightComponent
              liveOnly={params.liveOnly}
              onGameVersionSelect={handleGameVersionSelect}
              onLiveOnlyToggle={handleLiveOnlyToggle}
            />
          ),
        }}
      />

      <View className="flex flex-1 bg-white dark:bg-[#111827]">
        <FlatList
          contentContainerClassName="px-4 py-3"
          data={liveruns}
          keyExtractor={(item: Pace) => item.worldId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PaceCard
              onPress={() => setSelectedPace(item)}
              gameVersion={item.gameVersion}
              itemData={item.itemData}
              key={item.worldId}
              user={item.user}
              worldId={item.worldId}
              eventList={item.eventList}
              contextEventList={item.contextEventList}
              isCheated={item.isCheated}
              nickname={item.nickname}
              isHidden={item.isHidden}
              lastUpdated={item.lastUpdated}
            />
          )}
        />
      </View>
      <PaceBottomSheet selectedPace={selectedPace} onBackdropPress={() => setSelectedPace(null)} />
    </>
  );
};

export default HomePage;
