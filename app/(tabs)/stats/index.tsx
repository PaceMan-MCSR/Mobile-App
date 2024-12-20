import { View, FlatList, Text } from "react-native";
import React, { useState, useMemo } from "react";
import { Stack } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import { useStatsData } from "@/hooks/useStatsData";
import PlayerCard from "@/components/PlayerCard";
import StatsRightComponent from "@/components/StatsRightComponent";
import { useAllUsersData } from "@/hooks/useAllUsersData";
import { statsDaysToName, statsCategoryToName, statsTypeToName } from "@/lib/utils/frontendConverters";
import ErrorScreen from "@/components/ErrorScreen";

const StatsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [params, setParams] = useState({
    days: 30,
    category: "nether",
    type: "count" as "count" | "average" | "fastest" | "conversion",
  });

  const { data: stats, isLoading, isError } = useStatsData(params);
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

  if (isError) {
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
        <ErrorScreen />
      </>
    );
  }

  if (!stats.length) {
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
        <ErrorScreen message={`No stats available for this category yet...`} />
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
            renderItem={({ item }) => <PlayerCard uuid={item.id} nickname={item.nick} type="search" />}
          />
        ) : (
          <FlatList
            data={stats}
            keyboardDismissMode="on-drag"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.uuid}-${index}`}
            ListHeaderComponent={() => (
              <>
                <Text className="text-2xl p-4 font-bold text-text-primary">{`Stats for ${statsCategoryToName.get(
                  params.category
                )} based on ${statsTypeToName.get(params.type)} (${statsDaysToName.get(params.days)})`}</Text>
                <View className="flex flex-row w-full items-center p-4 gap-3">
                  <Text className="flex min-w-10 text-text-primary text-xl font-black">#</Text>
                  <Text className="flex flex-1 text-text-primary text-xl font-black">Player</Text>
                  <Text className="text-text-primary text-xl font-black">{statsTypeToName.get(params.type)}</Text>
                </View>
              </>
            )}
            renderItem={({ item, index }) => (
              <PlayerCard
                uuid={item.uuid}
                nickname={item.name}
                index={index}
                time={item.value}
                type={params.type}
                score={item.value}
              />
            )}
          />
        )}
      </View>
    </>
  );
};

export default StatsPage;
