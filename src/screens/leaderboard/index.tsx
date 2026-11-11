/* eslint-disable react-hooks/purity */
import PlayerCard from "@/components/player-card";
import { useLeaderboardData } from "@/hooks/api/use-leaderboard-data";
import { LeaderboardEntry, TrophyEntry } from "@/lib/types/Leaderboard";
import ErrorScreen from "@/screens/+error";
import LoadingScreen from "@/screens/+loading";
import { LEADERBOARDS, TROPHIES } from "@/screens/leaderboard/constants/leaderboards";
import { LegendList } from "@legendapp/list/react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, Text, View } from "react-native";

const LEADERBOARD_FILTERS = Array.from([...LEADERBOARDS.keys(), ...TROPHIES.keys()]);

export const LeaderboardScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leaderboardId = id ?? "monthly";
  const router = useRouter();
  const [params, setParams] = useState({
    filter: LEADERBOARD_FILTERS.indexOf(leaderboardId) !== -1 ? LEADERBOARD_FILTERS.indexOf(leaderboardId) : 2,
    removeDuplicates: true,
    date: Date.now(),
    season:
      LEADERBOARD_FILTERS.includes(leaderboardId) && leaderboardId.startsWith("season") ? leaderboardId : "current",
  });

  const { data: leaderboard, refetch, isPending, isError, isRefetching } = useLeaderboardData(params);

  const handleSelect = (key: string) => {
    const isTrophy = TROPHIES.has(key);
    setParams((prevParams) => ({
      ...prevParams,
      filter: LEADERBOARD_FILTERS.indexOf(key),
      season: isTrophy ? key : "current",
    }));
    if (id) {
      router.setParams({ id: key });
    } else {
      router.replace({ pathname: "/lb/[id]", params: { id: key } });
    }
  };

  return (
    <>
      {/* HEADER */}
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon={"line.3.horizontal"} accessibilityLabel="Leaderboard filters">
          {Array.from(LEADERBOARDS).map(([key, label]) => (
            <Stack.Toolbar.MenuAction key={key} isOn={leaderboardId === key} onPress={() => handleSelect(key)}>
              {label}
            </Stack.Toolbar.MenuAction>
          ))}
          <Stack.Toolbar.Menu title="Trophies">
            {Array.from(TROPHIES).map(([key, label]) => (
              <Stack.Toolbar.MenuAction key={key} isOn={leaderboardId === key} onPress={() => handleSelect(key)}>
                {label.replace("Trophy - ", "")}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {/* SCREEN */}
      {isError ? (
        <ErrorScreen />
      ) : isPending || leaderboard == null ? (
        <LoadingScreen />
      ) : !leaderboard.length ? (
        <View className="flex flex-1 items-center justify-center bg-white dark:bg-[#111827]">
          <Text className="text-lg text-black dark:text-white">There are no completions yet...</Text>
        </View>
      ) : (
        <LegendList
          className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
          contentInsetAdjustmentBehavior="automatic"
          data={params.filter >= 4 ? (leaderboard as TrophyEntry[]) : (leaderboard as LeaderboardEntry[])}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-6 py-3"
          contentContainerStyle={{ gap: 32 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
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
      )}
    </>
  );
};
