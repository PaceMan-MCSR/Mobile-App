import PlayerCard from "@/components/player-card";
import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { useSettingsForToken, useTokenForRunner } from "@/providers/notifications/hooks/api/use-token-for-runner";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";

const RunnersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tintColor } = useColorsForUI();
  const { data: tokenSettings } = useSettingsForToken();
  const { addTokenForRunnerMutation, deleteTokenForRunnerMutation } = useTokenForRunner();
  const { data: users, isLoading, isError } = useAllUsersData();

  // Get enabled runners from token settings
  const enabledRunnersSet = useMemo(() => {
    return new Set(tokenSettings?.runners || []);
  }, [tokenSettings?.runners]);

  const filteredUsers = useMemo(() => {
    if (!users || searchQuery.trim() === "") return users || [];

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return users.filter((user) => user.nick.toLowerCase().includes(normalizedQuery));
  }, [users, searchQuery]);

  const handleSearch = (event: { nativeEvent: { text: string } }) => {
    setSearchQuery(event.nativeEvent.text);
  };

  const toggleRunnerNotification = (runnerId: string, runnerNick: string) => {
    const isEnabled = enabledRunnersSet.has(runnerId);

    if (isEnabled) {
      deleteTokenForRunnerMutation.mutate({ runnerId });
    } else {
      addTokenForRunnerMutation.mutate({ runnerId });
    }
  };

  const Header = () => {
    return (
      <Stack.Screen
        options={Platform.select({
          ios: {
            headerSearchBarOptions: {
              placeholder: "Search for Speedrunners",
              onChangeText: handleSearch,
              placement: "automatic",
            },
          },
          android: {
            headerSearchBarOptions: {
              placeholder: "Search for Speedrunners",
              onChangeText: handleSearch,
              placement: "automatic",
            },
          },
        })}
      />
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <View className="flex flex-1 items-center justify-center bg-[#F2F2F2] dark:bg-[#111827]">
          <Text className="text-lg text-black dark:text-[#ECEDEE]">Loading runners...</Text>
        </View>
      </>
    );
  }

  if (isError || !filteredUsers) {
    return (
      <>
        <Header />
        <View className="flex flex-1 items-center justify-center bg-[#F2F2F2] dark:bg-[#111827]">
          <Text className="text-lg text-black dark:text-[#ECEDEE]">Failed to load runners</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Header />
      <FlatList
        data={filteredUsers}
        className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
        keyExtractor={(item) => item.id}
        keyboardDismissMode="on-drag"
        contentContainerClassName="px-4 py-3 gap-4"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item }) => {
          const isEnabled = enabledRunnersSet.has(item.id);
          return (
            <View className="flex flex-row items-center justify-between rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
              <View className="flex flex-1">
                <PlayerCard type="search" uuid={item.id} nickname={item.nick} />
              </View>
              <TouchableOpacity
                onPress={() => toggleRunnerNotification(item.id, item.nick)}
                activeOpacity={0.6}
                className="p-2"
              >
                <SymbolView name={isEnabled ? "bell.fill" : "bell.slash"} tintColor={tintColor} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </>
  );
};

export default RunnersPage;
