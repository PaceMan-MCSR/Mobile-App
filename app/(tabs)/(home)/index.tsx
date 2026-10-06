import HeaderButtonHome from "@/components/header-buttons/home";
import PaceBottomSheet from "@/components/pace-bottom-sheet";
import PaceCard from "@/components/pace-card";
import ErrorScreen from "@/components/screens/error-screen";
import LoadingScreen from "@/components/screens/loading-screen";
import { useLiverunsData } from "@/hooks/api/use-liveruns-data";
import { Pace } from "@/lib/types/Pace";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

const HomePage = () => {
  const [params, setParams] = useState({
    gameVersion: "1.16.1",
    liveOnly: false,
  });
  const { data: liveruns, isPending, isError } = useLiverunsData(params);

  const [selected, setSelected] = useState<string | null>(null);
  const selectedPace = liveruns?.find((run) => run.worldId === selected) ?? null;

  // CLOSE THE SHEET IF THE SELECTED PACE DISAPPEARS
  useEffect(() => {
    if (selected && !liveruns?.some((run) => run.worldId === selected)) {
      setSelected(null);
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

  // TOP HEADER
  const Header = () => {
    return (
      <HeaderButtonHome
        gameVersion={params.gameVersion}
        liveOnly={params.liveOnly}
        onGameVersionSelect={handleGameVersionSelect}
        onLiveOnlyToggle={handleLiveOnlyToggle}
      />
    );
  };

  // ERROR
  if (isError)
    return (
      <>
        <Header />
        <ErrorScreen />
      </>
    );

  // A query can be pending without fetching while this tab is unfocused.
  // Keep the screen safe until it has data instead of assuming an array exists.
  if (isPending || liveruns == null)
    return (
      <>
        <Header />
        <LoadingScreen />
      </>
    );

  // NO ONE ON PACE
  if (!liveruns.length)
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
      <PaceBottomSheet selectedPace={selectedPace} onDismiss={() => setSelected(null)} />
    </>
  );
};

export default HomePage;
