import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import LBRightComponent from "@/components/LBRightComponent";
import PlayerCard from "@/components/PlayerCard";
import LoadingScreen from "@/components/LoadingScreen";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { useHeaderHeight } from "@react-navigation/elements";
import { lbIdToName } from "@/lib/utils/frontendConverters";
import ErrorScreen from "@/components/ErrorScreen";

const filters = ["daily", "weekly", "monthly", "all", "current", "season-1", "season-2"];

const LeaderboardPage = () => {
  const headerHeight = Math.ceil(useHeaderHeight());
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [params, setParams] = useState({
    filter: filters.indexOf(id) !== -1 ? filters.indexOf(id) : 2,
    removeDuplicates: true,
    date: Date.now(),
    season: filters.includes(id) && id.startsWith("season") ? id : "current",
  });

  const { data: leaderboard, isLoading, isError } = useLeaderboardData(params);

  const handleSelect = (key: string) => {
    const isTrophy = ["current", "season-1", "season-2"].includes(key);
    setParams((prevParams) => ({
      ...prevParams,
      filter: filters.indexOf(key),
      season: isTrophy ? key : "current",
    }));
    router.setParams({ id: key });
  };

  useEffect(() => {
    if (filters.includes(id)) {
      setParams((prevParams) => ({
        ...prevParams,
        filter: filters.indexOf(id),
        season: ["current", "season-1", "season-2"].includes(id) ? id : "current",
      }));
    }
  }, [id]);

  if (isLoading) {
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
  }

  if (isError) {
    return (
      <>
        <Tabs.Screen
          options={{
            headerRight: () => <LBRightComponent onSelect={handleSelect} selectedKey={id ?? "monthly"} />,
          }}
        />
        <ErrorScreen />
      </>
    );
  }

  if (!leaderboard.length) {
    return (
      <>
        <Tabs.Screen
          options={{
            headerRight: () => <LBRightComponent onSelect={handleSelect} selectedKey={id ?? "monthly"} />,
          }}
        />
        <View className="flex flex-1 items-center justify-center bg-white dark:bg-[#111827]">
          <Text className="text-black dark:text-white text-lg">There are no completions yet...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => <LBRightComponent onSelect={handleSelect} selectedKey={id ?? "monthly"} />,
        }}
      />
      <View className="flex flex-1 bg-background-primary">
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={leaderboard}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View className="p-4">
              <Text className="text-2xl font-bold text-text-primary">{`PaceMan.gg Leaderboard`}</Text>
              <Text className="text-2xl font-bold text-text-primary pb-8">{`(${lbIdToName.get(id)})`}</Text>
              <View className="flex flex-row w-full items-center gap-3">
                <Text className="flex min-w-10 text-text-primary text-xl font-black">#</Text>
                <Text className="flex flex-1 text-text-primary text-xl font-black">Player</Text>
                <Text className="text-text-primary text-xl font-black">Time</Text>
              </View>
            </View>
          )}
          renderItem={({ item, index }) =>
            params.filter >= 4 ? (
              <PlayerCard
                type="trophy"
                score={item.score}
                index={index}
                uuid={item.uuid}
                nickname={item.nickname}
                time={item.pb}
              />
            ) : (
              <PlayerCard type="leaderboard" index={index} uuid={item.uuid} nickname={item.nickname} time={item.time} />
            )
          }
        />
      </View>
    </>
  );
};

export default LeaderboardPage;
