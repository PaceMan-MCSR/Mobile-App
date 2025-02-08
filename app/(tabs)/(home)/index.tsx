import PaceCard from "@/components/PaceCard";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import PaceBottomSheet from "@/components/PaceBottomSheet";
import HeaderHomeRight from "@/components/ui/HeaderHomeRight";
import { Tabs } from "expo-router";
import { Pace } from "@/lib/types/Pace";
import { FlatList, View } from "react-native";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import { useRef, useState, useCallback, useEffect } from "react";
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

const HomePage = () => {
  const [params, setParams] = useState({
    gameVersion: "1.16.1",
    liveOnly: false,
  });
  const { data: liveruns, isLoading, isError } = useLiverunsData(params);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // CLOSE BOTTOM SHEET IF PACE RESET
  useEffect(() => {
    if (!liveruns?.some((run) => run.worldId === selected)) {
      bottomSheetRef.current?.close();
    }
  }, [selected, liveruns]);

  // HEADER RIGHT FUNCTIONS
  const handleLiveOnlyToggle = () => {
    setSelected(null);
    setParams((prevParams) => ({
      ...prevParams,
      liveOnly: !prevParams.liveOnly,
    }));
  };

  const handleGameVersionSelect = (version: string) => {
    setSelected(null);
    setParams((prevParams) => ({
      ...prevParams,
      gameVersion: version,
    }));
  };

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
      setSelected(null);
    }
  }, []);

  // TOP HEADER
  const Header = () => {
    return (
      <Tabs.Screen
        options={{
          headerRight: () => (
            <HeaderHomeRight
              gameVersion={params.gameVersion}
              liveOnly={params.liveOnly}
              onGameVersionSelect={handleGameVersionSelect}
              onLiveOnlyToggle={handleLiveOnlyToggle}
            />
          ),
        }}
      />
    );
  };

  // LOADING
  if (isLoading)
    return (
      <>
        <Header />
        <LoadingScreen />
      </>
    );

  // ERROR
  if (isError)
    return (
      <>
        <Header />
        <ErrorScreen />
      </>
    );

  // NO ONE ON PACE
  if (!liveruns!.length)
    return (
      <>
        <Header />
        <ErrorScreen message="No one is currently on pace..." />
      </>
    );

  // MAIN SCREEN
  return (
    <>
      <Header />
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
                setSelected(item.worldId);
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
        selected={selected}
        params={params}
        onBackdropPress={() => setSelected(null)}
        renderBackdrop={renderBackdrop}
        onSheetChanges={handleSheetChanges}
      />
    </>
  );
};

export default HomePage;
