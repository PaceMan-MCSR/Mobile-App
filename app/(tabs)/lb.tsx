import LoadingScreen from "@/components/LoadingScreen";
import React, { useState } from "react";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { View, Text, FlatList } from "react-native";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
}

const LeaderboardPage = () => {
  // const filterTypes = new Set(["daily", "weekly", "monthly", "all", "trophy"]);
  // const trophyOptions = ["current", "season 1"];
  // const filters = ["daily", "weekly", "monthly", "all", "trophy"];
  const [params, setParams] = useState<LeaderboardParams>({
    filter: 3,
    removeDuplicates: true,
    date: Date.now(),
  });
  const { data: leaderboard, isLoading } = useLeaderboardData(params);

  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex flex-1 bg-white dark:bg-[#111827]">
      <FlatList
        data={leaderboard}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Text className="text-black dark:text-white">{item.nickname}</Text>}
      />
    </View>
  );
};

export default LeaderboardPage;
