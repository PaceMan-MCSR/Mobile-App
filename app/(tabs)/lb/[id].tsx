import LoadingScreen from "@/components/LoadingScreen";
import RankCard from "@/components/RankCard";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { useLeaderboardData } from "@/hooks/useLeaderboardData";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import LBDropdownMenu from "@/components/LBDropdownMenu";

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

  const handleSelect = (key: string) => {
    const selectedIndex = parseInt(key);
    const selectedFilter = filters[selectedIndex];

    setParams((prevParams) => ({
      ...prevParams,
      filter: selectedIndex,
    }));

    router.setParams({ id: selectedFilter });

    console.log(`Selected ${selectedFilter} at index ${selectedIndex}`);
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

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Tabs.Screen
        options={{
          headerTitle: `Leaderboard - ${id}`,
          headerRight: () => <LBDropdownMenu onSelect={handleSelect} />,
        }}
      />
      <View className="flex flex-1 bg-white dark:bg-[#111827]">
        <FlashList
          contentContainerClassName="p-2"
          data={leaderboard}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: { item: { uuid: string; nickname: string; time: number }; index: any }) => (
            <RankCard index={index} uuid={item.uuid} nickname={item.nickname} score={item.time} />
          )}
          estimatedItemSize={100}
        />
      </View>
    </>
  );
};

export default LeaderboardPage;
