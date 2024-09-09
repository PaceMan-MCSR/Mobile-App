import LoadingScreen from "@/components/LoadingScreen";
import React, { useEffect, useState } from "react";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { View, Text, FlatList, Button } from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
}

const LeaderboardPage = () => {
  const filters = ["daily", "weekly", "monthly", "all", "trophy"];
  const { id } = useGlobalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [params, setParams] = useState<LeaderboardParams>({
    filter: 3,
    removeDuplicates: true,
    date: Date.now(),
  });
  const { data: leaderboard, isLoading } = useLeaderboardData(params);
  useEffect(() => {
    const filterIndex = filters.indexOf(id ?? "all");
    setParams((prevParams) => ({
      ...prevParams,
      filter: filterIndex,
    }));
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
      <FlatList
        data={leaderboard}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Text className="text-black dark:text-white">{item.nickname}</Text>}
      />
    </View>
  );
};

export default LeaderboardPage;
