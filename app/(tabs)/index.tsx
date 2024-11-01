import PaceCard from "@/components/PaceCard";
import LoadingScreen from "@/components/LoadingScreen";
import { Pace } from "@/lib/types/Pace";
import { FlatList, Text, View } from "react-native";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import PaceBottomSheet from "@/components/PaceBottomSheet";
import { useRef, useState, useCallback } from "react";
import HomeRightComponent from "@/components/HomeRightComponent";
import { Tabs } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

const HomePage = () => {
  const [params, setParams] = useState({
    gameVersion: "1.16.1",
    liveOnly: false,
  });
  const { showActionSheetWithOptions } = useActionSheet();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { data: liveruns, isLoading } = useLiverunsData(params);
  const [selectedPace, setSelectedPace] = useState<Pace | null>(null);

  // HEADER RIGHT FUNCTIONS
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

  const headerRight = useCallback(
    () => (
      <HomeRightComponent
        liveOnly={params.liveOnly}
        onGameVersionSelect={handleGameVersionSelect}
        onLiveOnlyToggle={handleLiveOnlyToggle}
      />
    ),
    [params.liveOnly]
  );

  // BOTTOM SHEET FUNCTIONS
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => bottomSheetRef.current?.close()}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedPace(null);
    }
  }, []);

  const handlePaceCardPress = (item: Pace) => {
    bottomSheetRef.current?.expand();
    setSelectedPace(item);
  };

  if (isLoading)
    return (
      <>
        <Tabs.Screen options={{ headerRight }} />
        <LoadingScreen />
      </>
    );

  if (!liveruns.length)
    return (
      <>
        <Tabs.Screen options={{ headerRight }} />
        <View className="flex flex-1 items-center justify-center bg-white dark:bg-[#111827]">
          <Text className="text-black dark:text-white text-lg">No one is currently on pace...</Text>
        </View>
      </>
    );

  return (
    <>
      <Tabs.Screen options={{ headerRight }} />
      <View className="flex flex-1 bg-white dark:bg-[#111827]">
        {/* PACE LIST */}
        <FlatList
          contentContainerClassName="px-4 py-3"
          data={liveruns}
          keyExtractor={(item: Pace) => item.worldId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PaceCard
              onPress={() => {
                setSelectedPace(item);
                bottomSheetRef.current?.expand();
              }}
              worldId={item.worldId}
              splitName={item.splitName}
              time={item.time}
              isHighQuality={item.isHighQuality}
              split={item.split}
              gameVersion={item.gameVersion}
              twitch={item.twitch}
              uuid={item.uuid}
              eventList={item.eventList}
              nickname={item.nickname}
              lastUpdated={item.lastUpdated}
            />
          )}
        />
      </View>
      {/* BOTTOM SHEET */}
      <PaceBottomSheet
        ref={bottomSheetRef}
        selectedPace={selectedPace}
        onBackdropPress={() => setSelectedPace(null)}
        renderBackdrop={renderBackdrop}
        onSheetChanges={handleSheetChanges}
      />
    </>
  );
};

export default HomePage;
