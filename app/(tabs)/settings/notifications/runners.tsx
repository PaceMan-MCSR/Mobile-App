import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { useNotification } from "@/providers/notifications";
import { useSettingsForToken, useTokenForRunner } from "@/providers/notifications/hooks/api/use-token-for-runner";
import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";

const RunnersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tintColor } = useColorsForUI();
  const { expoPushToken } = useNotification();
  const { data: tokenSettings } = useSettingsForToken({ expoToken: expoPushToken || "" });
  const { addTokenForRunnerMutation, deleteTokenForRunnerMutation } = useTokenForRunner();
  const { data: users, isLoading, isError } = useAllUsersData();
  const queryClient = useQueryClient();

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
    if (!expoPushToken) {
      console.error("[Runners] Expo push token not available");
      return;
    }

    const queryKey = ["token-settings", expoPushToken];
    const isEnabled = enabledRunnersSet.has(runnerId);

    console.log(
      `[Runners] Toggle notification for ${runnerNick} (${runnerId}) - currently ${isEnabled ? "enabled" : "disabled"}`
    );

    if (isEnabled) {
      // Disable notifications - optimistic update
      console.log(`[Runners] Optimistically removing ${runnerNick} from runners list`);
      queryClient.setQueryData(queryKey, (old: any) => {
        const currentRunners = old?.runners || [];
        const newRunners = currentRunners.filter((id: string) => id !== runnerId);
        console.log(`[Runners] Optimistic update - old runners:`, currentRunners, "new runners:", newRunners);
        return {
          ...old,
          runners: newRunners,
        };
      });

      deleteTokenForRunnerMutation.mutate(
        {
          expoToken: expoPushToken,
          runnerId,
        },
        {
          onSuccess: (data) => {
            console.log(`[Runners] Notifications disabled for runner ${runnerNick}:`, data);
            // Invalidate and refetch token settings to ensure consistency
            queryClient.invalidateQueries({ queryKey });
          },
          onError: (error) => {
            console.error(`[Runners] Failed to disable notifications for runner ${runnerNick}:`, error);
            // Rollback on error
            queryClient.invalidateQueries({ queryKey });
          },
          onSettled: () => {
            console.log(`[Runners] Delete mutation settled for ${runnerNick}`);
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey });
          },
        }
      );
    } else {
      // Enable notifications - optimistic update
      console.log(`[Runners] Optimistically adding ${runnerNick} to runners list`);
      queryClient.setQueryData(queryKey, (old: any) => {
        const currentRunners = old?.runners || [];
        const newRunners = [...currentRunners, runnerId];
        console.log(`[Runners] Optimistic update - old runners:`, currentRunners, "new runners:", newRunners);
        return {
          ...old,
          runners: newRunners,
        };
      });

      addTokenForRunnerMutation.mutate(
        {
          expoToken: expoPushToken,
          runnerId,
        },
        {
          onSuccess: (data) => {
            console.log(`[Runners] Notifications enabled for runner ${runnerNick}:`, data);
            // Invalidate and refetch token settings to ensure consistency
            queryClient.invalidateQueries({ queryKey });
          },
          onError: (error) => {
            console.error(`[Runners] Failed to enable notifications for runner ${runnerNick}:`, error);
            // Rollback on error
            queryClient.invalidateQueries({ queryKey });
          },
          onSettled: () => {
            console.log(`[Runners] Add mutation settled for ${runnerNick}`);
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey });
          },
        }
      );
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
              <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">{item.nick}</Text>
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
