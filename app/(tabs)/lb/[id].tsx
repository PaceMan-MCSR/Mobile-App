import LoadingScreen from "@/components/LoadingScreen";
import RankCard from "@/components/RankCard";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { View, Button } from "react-native";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { useLocalSearchParams, useRouter } from "expo-router";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
}

const LeaderboardPage = () => {
  const filters = ["daily", "weekly", "monthly", "all", "trophy"];
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [params, setParams] = useState<LeaderboardParams>({
    filter: filters.indexOf(id) !== -1 ? filters.indexOf(id) : 3,
    removeDuplicates: true,
    date: Date.now(),
  });
  const { data: leaderboard, isLoading } = useLeaderboardData(params);

  useEffect(() => {
    const filterIndex = filters.indexOf(id);
    if (filterIndex !== -1) {
      setParams((prevParams) => ({
        ...prevParams,
        filter: filterIndex,
      }));
    }
  }, [id]);

  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex flex-1 bg-white dark:bg-[#111827]">
      <View className="flex flex-row justify-center">
        <Button title="daily" onPress={() => router.setParams({ id: "daily" })} />
        <Button title="weekly" onPress={() => router.setParams({ id: "weekly" })} />
        <Button title="monthly" onPress={() => router.setParams({ id: "monthly" })} />
        <Button title="all" onPress={() => router.setParams({ id: "all" })} />
        {/* <Button title="trophy" onPress={() => router.setParams({ id: "trophy" })} /> */}
        {/* TODO: Fix Trophy API */}
      </View>
      <FlashList
        contentContainerClassName="p-2"
        data={leaderboard}
        showsVerticalScrollIndicator={false}
        // FIXME: Type Definitions
        renderItem={({ item, index }: { item: { uuid: string; nickname: string; time: number }; index: any }) => (
          <RankCard index={index} uuid={item.uuid} nickname={item.nickname} score={item.time} />
        )}
        estimatedItemSize={100}
      />
    </View>
  );
};

export default LeaderboardPage;
