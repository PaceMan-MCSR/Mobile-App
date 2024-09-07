import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import LoadingScreen from "@/components/LoadingScreen";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
}

const LeaderboardPage = () => {
  const filterTypes = new Set(["daily", "weekly", "monthly", "all", "trophy"]);
  const trophyOptions = ["current", "season 1"];
  const filters = ["daily", "weekly", "monthly", "all", "trophy"];
  const [Enable, setEnable] = useState("courses");
  const [leaderboardAPIParams, setLeaderboardAPIParams] = useState<LeaderboardParams>({
    filter: 3,
    removeDuplicates: true,
    date: Date.now(),
  });
  const { data: leaderboard, isLoading } = useLeaderboardData(leaderboardAPIParams);
  if (isLoading) return <LoadingScreen />;
  return (
    <View className="bg-white dark:bg-[#111827]">
      <FlatList
        data={leaderboard}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Text className="text-black dark:text-white">{item.nickname}</Text>}
      />
    </View>
  );
};

export default LeaderboardPage;
