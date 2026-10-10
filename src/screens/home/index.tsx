import HeaderButtonHome from "@/components/header-buttons/home";
import PaceBottomSheet from "@/components/pace-bottom-sheet";
import PaceCard from "@/components/pace-card";
import { useLiverunsData } from "@/hooks/api/use-liveruns-data";
import { Pace } from "@/lib/types/Pace";
import { useSelectedPace } from "@/providers/selected-pace";
import ErrorScreen from "@/screens/+error";
import LoadingScreen from "@/screens/+loading";
import { LegendList } from "@legendapp/list/react-native";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export const HomeScreen = () => {
  const [params, setParams] = useState({
    gameVersion: "1.16.1",
    liveOnly: false,
  });
  const { data: liveruns, isPending, isError, isSuccess } = useLiverunsData(params);
  const { selectedPace, isPresented, selectionId, selectPace, syncWithRuns, requestDismiss, finishDismiss } =
    useSelectedPace();

  // Missing or failed query data is not evidence that a run disappeared.
  // Also reconcile a new selection against the latest successful response.
  useEffect(() => {
    if (isSuccess && liveruns) syncWithRuns(liveruns);
  }, [isSuccess, liveruns, selectionId, syncWithRuns]);

  const handleDismiss = useCallback(() => finishDismiss(selectionId), [finishDismiss, selectionId]);

  // HEADER RIGHT FUNCTIONS
  const handleLiveOnlyToggle = () => {
    requestDismiss();
    setParams((prevParams) => ({
      ...prevParams,
      liveOnly: !prevParams.liveOnly,
    }));
  };

  const handleGameVersionSelect = (version: string) => {
    requestDismiss();
    setParams((prevParams) => ({
      ...prevParams,
      gameVersion: version,
    }));
  };

  return (
    <>
      <HeaderButtonHome
        gameVersion={params.gameVersion}
        liveOnly={params.liveOnly}
        onGameVersionSelect={handleGameVersionSelect}
        onLiveOnlyToggle={handleLiveOnlyToggle}
      />
      {isError ? (
        <ErrorScreen />
      ) : isPending || liveruns == null ? (
        <LoadingScreen />
      ) : !liveruns.length ? (
        <ErrorScreen message="No one is currently on pace..." />
      ) : (
        <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
          {/* PACE LIST */}
          <LegendList
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="p-4"
            contentContainerStyle={{ gap: 16 }}
            data={liveruns}
            keyExtractor={(item: Pace) => item.worldId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PaceCard
                onPress={() => selectPace(item)}
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
      )}

      {/* Retain the sheet across query states and only unmount after native dismissal. */}
      {selectedPace ? (
        <PaceBottomSheet
          key={selectionId}
          selectedPace={selectedPace}
          isPresented={isPresented}
          onDismissRequest={requestDismiss}
          onDismiss={handleDismiss}
        />
      ) : null}
    </>
  );
};
