import PlayerCard from "@/components/PlayerCard";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import HeaderStatsRight from "@/components/ui/HeaderStatsRight";
import { CategoriesType, DaysType, SortByType } from "@/components/ui/HeaderStatsRight/options";
import { useAllUsersData } from "@/hooks/useAllUsersData";
import { useStatsData } from "@/hooks/useStatsData";
import { statsCategoryToName, statsDaysToName, statsTypeToName } from "@/lib/utils/frontendConverters";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";

const StatsPage = () => {
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

  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useStatsData(params);
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

  const Header = () => {
    return (
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search for Speedrunners",
            onChangeText: handleSearch,
          },
          headerRight: () => (
            <HeaderStatsRight
              sortBy={params.type}
              category={params.category}
              days={params.days}
              onSortSelect={handleTypeSelect}
              onCategorySelect={handleCategorySelect}
              onDaysSelect={handleDaysSelect}
            />
          ),
        }}
      />
    );
  };

  // LOADING
  if (isStatsLoading || (searchQuery.trim() && isUsersLoading)) {
    return (
      <>
        <Header />
        <LoadingScreen />
      </>
    );
  }

  // ERROR
  if (isStatsError || (searchQuery.trim() && isUsersError)) {
    return (
      <>
        <Header />
        <ErrorScreen />
      </>
    );
  }

  // NO ENTRIES
  if (!stats!.length) {
    return (
      <>
        <Header />
        <ErrorScreen message={`No stats available for this category yet...`} />
      </>
    );
  }

  // SEARCHING
  if (searchQuery.trim())
    return (
      <>
        <Header />
        <FlatList
          data={filteredUsers}
          className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          contentContainerClassName={`px-4 py-3 gap-8`}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          renderItem={({ item }) => <PlayerCard uuid={item.id} nickname={item.nick} type="search" />}
        />
      </>
    );
  // MAIN SCREEN
  return (
    <>
      <Header />
      <FlatList
        data={stats}
        className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
        keyExtractor={(item, index) => `${item.uuid}-${index}`}
        keyboardDismissMode="on-drag"
        contentContainerClassName={`px-4 py-3 gap-8`}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={() => (
          <>
            <Text className="pb-8 text-2xl font-bold text-black dark:text-[#ECEDEE]">{`Stats for ${statsCategoryToName.get(
              params.category
            )} based on ${statsTypeToName.get(params.type)} (${statsDaysToName.get(params.days)})`}</Text>
            <View className="flex w-full flex-row items-center gap-3">
              <Text className="flex min-w-10 text-xl font-black text-black dark:text-[#ECEDEE]">#</Text>
              <Text className="flex flex-1 text-xl font-black text-black dark:text-[#ECEDEE]">Player</Text>
              <Text className="text-xl font-black text-black dark:text-[#ECEDEE]">
                {statsTypeToName.get(params.type)}
              </Text>
            </View>
          </>
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
    </>
  );
};

export default StatsPage;
