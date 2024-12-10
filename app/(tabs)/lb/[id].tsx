import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import LBRightComponent from "@/components/LBRightComponent";
import PlayerCard from "@/components/PlayerCard";
import LoadingScreen from "@/components/LoadingScreen";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";

const filters = ["daily", "weekly", "monthly", "all", "current", "season-1", "season-2"];

const LeaderboardPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [params, setParams] = useState({
    filter: filters.indexOf(id) !== -1 ? filters.indexOf(id) : 2,
    removeDuplicates: true,
    date: Date.now(),
    season: filters.includes(id) && id.startsWith("season") ? id : "current",
  });

  const { data: leaderboard, isLoading } = useLeaderboardData(params);

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

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => <LBRightComponent onSelect={handleSelect} selectedKey={id ?? "monthly"} />,
        }}
      />
      <View className="flex flex-1 bg-white dark:bg-[#111827]">
        <FlatList
          data={leaderboard}
          showsVerticalScrollIndicator={false}
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
