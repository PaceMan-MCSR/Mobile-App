import { View, FlatList, Text } from "react-native";
import React, { useState, useMemo } from "react";
import { Stack } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import { useStatsData } from "@/hooks/useStatsData";
import PlayerCard from "@/components/PlayerCard";
import StatsRightComponent from "@/components/StatsRightComponent";
import { useAllUsersData } from "@/hooks/useAllUsersData";

const StatsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [params, setParams] = useState({
    days: 30,
    category: "nether",
    type: "count" as "count" | "average" | "fastest" | "conversion",
  });

  const { data: stats, isLoading } = useStatsData(params);
  const { data: users, isLoading: isUsersLoading } = useAllUsersData();

  const filteredUsers = useMemo(() => {
    if (!users || searchQuery.trim() === "") return null;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return users.filter((user) => user.nick.toLowerCase().includes(normalizedQuery));
  }, [users, searchQuery]);

  const handleDaysSelect = (days: number) => {
    setParams((prev) => ({ ...prev, days }));
  };

  const handleCategorySelect = (category: string) => {
    setParams((prev) => ({ ...prev, category }));
  };

  const handleTypeSelect = (type: "count" | "average" | "fastest" | "conversion") => {
    setParams((prev) => ({ ...prev, type }));
  };

  const handleSearch = (event: { nativeEvent: { text: string } }) => {
    setSearchQuery(event.nativeEvent.text);
  };

  if (isLoading || isUsersLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerSearchBarOptions: {
              placeholder: "Search for Speedrunners",
              onChangeText: handleSearch,
            },
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
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search for Speedrunners",
            onChangeText: handleSearch,
          },
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
      <View className="flex flex-1 bg-background-primary">
        {searchQuery.trim() ? (
          <FlatList
            keyboardDismissMode="on-drag"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <PlayerCard uuid={item.id} nickname={item.nick} type="search" />}
          />
        ) : (
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
        )}
      </View>
    </>
  );
};

export default StatsPage;
