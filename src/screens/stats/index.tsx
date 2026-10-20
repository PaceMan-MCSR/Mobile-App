import PlayerCard from "@/components/player-card";
import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useStatsData } from "@/hooks/api/use-stats-data";
import { statsCategoryToName, statsDaysToName, statsTypeToName } from "@/lib/utils/frontend-converters";
import ErrorScreen from "@/screens/+error";
import LoadingScreen from "@/screens/+loading";
import type { CategoriesType, DaysType, SortByType } from "@/screens/stats/constants/filters";
import { CATEGORIES_FILTERS, DAYS_FILTERS, SORT_BY_FILTERS } from "@/screens/stats/constants/filters";
import MenuIcon from "@expo/material-symbols/menu.xml";
import { LegendList } from "@legendapp/list/react-native";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, Text, View } from "react-native";

const statsFilterIcon = process.env.EXPO_OS === "ios" ? "line.3.horizontal" : MenuIcon;

export const StatsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [params, setParams] = useState<{
    days: DaysType;
    category: CategoriesType;
    type: SortByType;
  }>({
    days: 30,
    category: "nether",
    type: "count",
  });

  const { data: stats, refetch, isPending: isStatsPending, isError: isStatsError, isRefetching } = useStatsData(params);
  const { data: users, isLoading: isUsersLoading, isError: isUsersError } = useAllUsersData();

  const filteredUsers = useMemo(() => {
    if (!users || searchQuery.trim() === "") return null;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return users.filter((user) => user.nick.toLowerCase().includes(normalizedQuery));
  }, [users, searchQuery]);

  const handleDaysSelect = (days: DaysType) => {
    setParams((prev) => ({ ...prev, days }));
  };

  const handleCategorySelect = (category: CategoriesType) => {
    setParams((prev) => ({ ...prev, category }));
  };

  const handleTypeSelect = (type: SortByType) => {
    setParams((prev) => ({ ...prev, type }));
  };

  const handleSearch = (event: { nativeEvent: { text: string } }) => {
    setSearchQuery(event.nativeEvent.text);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search for Speedrunners",
            onChangeText: handleSearch,
            placement: "automatic",
          },
        }}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon={statsFilterIcon} accessibilityLabel="Stats filters">
          <Stack.Toolbar.Menu title="Sort By">
            {SORT_BY_FILTERS.map(({ key, label }) => (
              <Stack.Toolbar.MenuAction key={key} isOn={params.type === key} onPress={() => handleTypeSelect(key)}>
                {label}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Menu title="Category">
            {CATEGORIES_FILTERS.map(({ key, label }) => (
              <Stack.Toolbar.MenuAction
                key={key}
                isOn={params.category === key}
                onPress={() => handleCategorySelect(key)}
              >
                {label}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Menu title="Time Period">
            {DAYS_FILTERS.map(({ key, label }) => (
              <Stack.Toolbar.MenuAction key={key} isOn={params.days === key} onPress={() => handleDaysSelect(key)}>
                {label}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {isStatsError || (searchQuery.trim() && isUsersError) ? (
        <ErrorScreen />
      ) : isStatsPending || stats == null || (searchQuery.trim() && isUsersLoading) ? (
        <LoadingScreen />
      ) : !stats.length ? (
        <ErrorScreen message="No stats available for this category yet..." />
      ) : searchQuery.trim() ? (
        <LegendList
          data={filteredUsers}
          className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          contentContainerClassName="px-4 py-3"
          contentContainerStyle={{ gap: 32 }}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item }) => <PlayerCard uuid={item.id} nickname={item.nick} type="search" />}
        />
      ) : (
        <LegendList
          data={stats}
          className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
          keyExtractor={(item, index) => `${item.uuid}-${index}`}
          keyboardDismissMode="on-drag"
          contentContainerClassName="px-4 py-3"
          contentContainerStyle={{ gap: 32 }}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListHeaderComponent={() => (
            <View className="gap-4 pb-4">
              <Text className="text-2xl font-bold text-black dark:text-[#ECEDEE]">{`Stats for ${statsCategoryToName.get(
                params.category
              )} based on ${statsTypeToName.get(params.type)} (${statsDaysToName.get(params.days)})`}</Text>
              <View className="flex w-full flex-row items-center gap-3">
                <Text className="flex min-w-10 text-xl font-black text-black dark:text-[#ECEDEE]">#</Text>
                <Text className="flex flex-1 text-xl font-black text-black dark:text-[#ECEDEE]">Player</Text>
                <Text className="text-xl font-black text-black dark:text-[#ECEDEE]">
                  {statsTypeToName.get(params.type)}
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item, index }) => (
            <PlayerCard
              type={params.type}
              uuid={item.uuid}
              nickname={item.name}
              index={index}
              time={item.value}
              score={item.value}
            />
          )}
        />
      )}
    </>
  );
};
