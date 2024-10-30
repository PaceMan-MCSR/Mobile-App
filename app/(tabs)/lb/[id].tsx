/**
TODO: 
- Refactor code to make it cleaner.
- Add Android icons.
- Make icon update upon click instead of updating when the content loads.
- Figure out if there's a way to have the dropdown menu not be required to be declared twice. It's not the end of the world but eh. Could use a ternary but neh.
*/

import LoadingScreen from "@/components/LoadingScreen";
import PlayerCard from "@/components/PlayerCard";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import LBRightComponent from "@/components/LBRightComponent";
import TrophyPicker from "@/components/TrophyPicker";
import { TrophyEntry } from "@/lib/types/TrophyEntry";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
  season: string;
}

const LeaderboardPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const filters = ["daily", "weekly", "monthly", "all", "trophy"];
  const [trophy, setTrophy] = useState(0);
  const router = useRouter();

  const [params, setParams] = useState<LeaderboardParams>({
    filter: filters.indexOf(id) !== -1 ? filters.indexOf(id) : 2,
    removeDuplicates: true,
    date: Date.now(),
    season: "current",
  });

  const { data: leaderboard, isLoading } = useLeaderboardData(params);

  const handleSelect = (key: string) => {
    const selectedIndex = parseInt(key);
    const selectedFilter = filters[selectedIndex];
    setParams((prevParams) => ({
      ...prevParams,
      filter: selectedIndex,
    }));
    router.setParams({ id: selectedFilter });
  };

  useEffect(() => {
    const filterIndex = filters.indexOf(id);
    if (filterIndex !== -1) {
      setParams((prevParams) => ({
        ...prevParams,
        filter: filterIndex,
      }));
    }
  }, [id]);

  if (isLoading)
    return (
      <>
        <Tabs.Screen
          options={{
            headerRight: () => <LBRightComponent onSelect={handleSelect} selectedKey={id ?? "monthly"} />,
          }}
        />

        <LoadingScreen />
      </>
    );

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => <LBRightComponent onSelect={handleSelect} selectedKey={id ?? "monthly"} />,
        }}
      />

      <View className="flex flex-1 bg-white dark:bg-[#111827]">
        <FlashList
          ListHeaderComponent={() =>
            params.filter === 4 && (
              <TrophyPicker values={["Current", "Season 1", "Season 2"]} season={0} onChange={() => {}} />
            )
          }
          contentContainerClassName="p-4"
          data={leaderboard}
          showsVerticalScrollIndicator={false}
          renderItem={
            params.filter === 4
              ? ({ item, index }: { item: TrophyEntry; index: any }) => (
                  <PlayerCard
                    type="trophy"
                    score={item.score}
                    index={index}
                    uuid={item.uuid}
                    nickname={item.nickname}
                    time={item.pb}
                  />
                )
              : ({ item, index }: { item: { uuid: string; nickname: string; time: number }; index: any }) => (
                  <PlayerCard
                    type="leaderboard"
                    index={index}
                    uuid={item.uuid}
                    nickname={item.nickname}
                    time={item.time}
                  />
                )
          }
          estimatedItemSize={100}
        />
      </View>
    </>
  );
};

export default LeaderboardPage;
