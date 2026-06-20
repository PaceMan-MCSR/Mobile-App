import { buildHomeMenuItems } from "@/components/header-buttons/home/options";
import HeaderMenu from "@/components/header-menu";
import PaceBottomSheet from "@/components/pace-bottom-sheet";
import PaceCard from "@/components/pace-card";
import ErrorScreen from "@/components/screens/error-screen";
import LoadingScreen from "@/components/screens/loading-screen";
import { useLiverunsData } from "@/hooks/api/use-liveruns-data";
import { Pace } from "@/lib/types/Pace";
import MenuIcon from "@expo/material-symbols/menu.xml";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";

const HomePage = () => {
  const [params, setParams] = useState({
    gameVersion: "1.16.1",
    liveOnly: false,
  });
  const { data: liveruns, isLoading, isError } = useLiverunsData(params);

  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // HEADER RIGHT FUNCTIONS
  const handleLiveOnlyToggle = () => {
    setIsSheetOpen(false);
    setParams((prevParams) => ({
      ...prevParams,
      liveOnly: !prevParams.liveOnly,
    }));
  };

  const handleGameVersionSelect = (version: string) => {
    setIsSheetOpen(false);
    setParams((prevParams) => ({
      ...prevParams,
      gameVersion: version,
    }));
  };

  // BOTTOM SHEET FUNCTIONS
  const handleDismiss = useCallback(() => setIsSheetOpen(false), []);

  // TOP HEADER
  const headerMenu = (
    <HeaderMenu
      icon={{ ios: "line.3.horizontal", android: MenuIcon }}
      items={buildHomeMenuItems({
        gameVersion: params.gameVersion,
        liveOnly: params.liveOnly,
        onGameVersionSelect: handleGameVersionSelect,
        onLiveOnlyToggle: handleLiveOnlyToggle,
      })}
    />
  );

  // LOADING
  if (isLoading)
    return (
      <>
        {headerMenu}
        <LoadingScreen />
      </>
    );

  // ERROR
  if (isError)
    return (
      <>
        {headerMenu}
        <ErrorScreen />
      </>
    );

  // NO ONE ON PACE
  if (!liveruns!.length)
    return (
      <>
        {headerMenu}
        <ErrorScreen message="No one is currently on pace..." />
      </>
    );

  // MAIN SCREEN
  return (
    <>
      {headerMenu}
      <View className={`flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]`}>
        {/* PACE LIST */}
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          contentContainerClassName={`p-4 gap-4`}
          data={liveruns}
          keyExtractor={(item: Pace) => item.worldId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PaceCard
              onPress={() => {
                setSelectedWorldId(item.worldId);
                setIsSheetOpen(true);
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
        liveruns={liveruns}
        selectedWorldId={selectedWorldId}
        isPresented={isSheetOpen}
        onDismiss={handleDismiss}
      />
    </>
  );
};

export default HomePage;
