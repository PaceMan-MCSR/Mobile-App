import HeaderButtonLB from "@/components/header-buttons/lb";
import { LeaderboardType } from "@/components/header-buttons/lb/options";
import PlayerCard from "@/components/PlayerCard";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { LeaderboardEntry, TrophyEntry } from "@/lib/types/Leaderboard";
import { lbIdToName } from "@/lib/utils/frontendConverters";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const filters = Array.from(lbIdToName.keys());

const LeaderboardPage = () => {
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
    const isTrophy = !["daily", "weekly", "monthly", "all"].includes(key);
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
        season: !["daily", "weekly", "monthly", "all"].includes(id) ? id : "current",
      }));
    }
  }, [id]);

  // TOP HEADER
  const Header = () => {
    return (
      <Tabs.Screen
        options={{
          headerLeft: () => (
            <HeaderButtonLB onSelect={handleSelect} leaderboard={(id as LeaderboardType) ?? "monthly"} />
          ),
        }}
      />
    );
  };

  // LOADING
  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingScreen />
      </>
    );
  }

  // ERROR
  if (isError) {
    return (
      <>
        <Header />
        <ErrorScreen />
      </>
    );
  }

  // NO ENTRIES
  if (!leaderboard!.length) {
    return (
      <>
        <Header />
        <View className="flex flex-1 items-center justify-center bg-white dark:bg-[#111827]">
          <Text className="text-lg text-black dark:text-white">There are no completions yet...</Text>
        </View>
      </>
    );
  }

  // MAIN SCREEN
  return (
    <>
      <Header />
      <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={params.filter >= 4 ? (leaderboard as TrophyEntry[]) : (leaderboard as LeaderboardEntry[])}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={`px-4 py-3 gap-8`}
          ListHeaderComponent={() => (
            <View>
              <Text className="text-2xl font-bold text-black dark:text-[#ECEDEE]">{`PaceMan.gg Leaderboard`}</Text>
              <Text className="pb-8 text-2xl font-bold text-black dark:text-[#ECEDEE]">{`(${lbIdToName.get(
                id
              )})`}</Text>
              <View className="flex w-full flex-row items-center gap-3">
                <Text className="flex min-w-10 text-xl font-black text-black dark:text-[#ECEDEE]">#</Text>
                <Text className="flex flex-1 text-xl font-black text-black dark:text-[#ECEDEE]">Player</Text>
                <Text className="text-xl font-black text-black dark:text-[#ECEDEE]">Time</Text>
              </View>
            </View>
          )}
          renderItem={({ item, index }) =>
            params.filter >= 4 ? (
              <PlayerCard
                type="trophy"
                index={index}
                score={item.score}
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
