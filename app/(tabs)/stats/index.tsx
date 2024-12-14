import { View, FlatList } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";

import LoadingScreen from "@/components/LoadingScreen";
import { useStatsData } from "@/hooks/useStatsData";
import PlayerCard from "@/components/PlayerCard";
import StatsRightComponent from "@/components/StatsRightComponent";

const StatsPage = () => {
  const [params, setParams] = useState({
    days: 30,
    category: "nether",
    type: "count" as "count" | "average" | "fastest" | "conversion",
  });
  const { data: stats, isLoading } = useStatsData(params);

  // Handlers to update params
  const handleDaysSelect = (days: number) => {
    setParams((prev) => ({ ...prev, days }));
  };

  const handleCategorySelect = (category: string) => {
    setParams((prev) => ({ ...prev, category }));
  };

  const handleTypeSelect = (type: "count" | "average" | "fastest" | "conversion") => {
    setParams((prev) => ({ ...prev, type }));
  };

  if (isLoading)
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: () => (
              <StatsRightComponent
                days={params.days}
                category={params.category}
                type={params.type}
                onDaysSelect={handleDaysSelect}
                onCategorySelect={handleCategorySelect}
                onTypeSelect={handleTypeSelect}
              />
            ),
          }}
        />
        <LoadingScreen />
      </>
    );

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <StatsRightComponent
              days={params.days}
              category={params.category}
              type={params.type}
              onDaysSelect={handleDaysSelect}
              onCategorySelect={handleCategorySelect}
              onTypeSelect={handleTypeSelect}
            />
          ),
        }}
      />
      <View className="flex flex-1 bg-white dark:bg-[#111827]">
        <FlatList
          keyboardDismissMode="on-drag"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          data={stats}
          keyExtractor={(item, index) => `${item.uuid}-${index}`}
          renderItem={({ item, index }) => (
            <PlayerCard uuid={item.uuid} nickname={item.name} index={index} time={item.avg} type="leaderboard" />
          )}
        />
      </View>
    </>
  );
};

export default StatsPage;
