import NotificationPlayerCard from "@/components/notification-player-card";
import PlayerCard from "@/components/player-card";
import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { useAddRunner } from "@/providers/notifications/hooks/api/use-add-runner";
import { useDeleteRunner } from "@/providers/notifications/hooks/api/use-delete-runner";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-settings-for-token";
import ErrorScreen from "@/screens/+error";
import LoadingScreen from "@/screens/+loading";
import { LegendList } from "@legendapp/list/react-native";
import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export const RunnersScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { tintColor } = useColorsForUI();
  const { data: tokenSettings } = useSettingsForToken();
  const { addTokenForRunnerMutation } = useAddRunner();
  const { deleteTokenForRunnerMutation } = useDeleteRunner();
  const { data: users, isLoading, isError } = useAllUsersData();

  // Get enabled runners from token settings
  const enabledRunnersSet = useMemo(() => {
    const runners = tokenSettings?.runners || [];
    return new Set(runners.map((r) => r.id));
  }, [tokenSettings?.runners]);

  // Get enabled runners with their user data
  const enabledRunners = useMemo(() => {
    const runners = tokenSettings?.runners || [];
    if (!users || runners.length === 0) return [];

    return runners
      .map((runner) => {
        const user = users.find((u) => u.id === runner.id);
        return user || null;
      })
      .filter((runner): runner is NonNullable<typeof runner> => runner !== null);
  }, [tokenSettings?.runners, users]);

  const filteredUsers = useMemo(() => {
    if (!users || searchQuery.trim() === "") return null;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return users.filter((user) => user.nick.toLowerCase().includes(normalizedQuery));
  }, [users, searchQuery]);

  const handleSearch = (event: { nativeEvent: { text: string } }) => {
    setSearchQuery(event.nativeEvent.text);
  };

  const toggleRunnerNotification = (runnerId: string, runnerNick: string) => {
    const isEnabled = enabledRunnersSet.has(runnerId);

    if (isEnabled) {
      Alert.alert(
        `Remove ${runnerNick ?? "Runner"}`,
        `Are you sure you want to opt out of receiving notifications for ${runnerNick ?? "this runner"}'s speedruns?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => deleteTokenForRunnerMutation.mutate({ runnerId }),
          },
        ]
      );
    } else {
      Alert.alert(
        `Add ${runnerNick ?? "Runner"}`,
        `Opt in to receiving notifications for ${runnerNick ?? "this runner"}'s speedruns?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add",
            onPress: () => addTokenForRunnerMutation.mutate({ runnerId }),
            isPreferred: true,
          },
        ]
      );
    }
  };

  const Header = () => {
    return (
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search for Speedrunners",
            hideWhenScrolling: false,
            onChangeText: handleSearch,
          },
        }}
      />
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !users) {
    return (
      <>
        <Header />
        <View className="flex flex-1 items-center justify-center bg-[#F2F2F2] dark:bg-[#111827]">
          <Text className="text-lg text-black dark:text-[#ECEDEE]">Failed to load runners</Text>
        </View>
      </>
    );
  }

  // NO RUNNERS - show error screen
  if (enabledRunners.length === 0 && !searchQuery.trim()) {
    return (
      <>
        <Header />
        <ErrorScreen message="No speedrunners added yet. Search for speedrunners to add them." />
      </>
    );
  }

  // SEARCHING - show filtered users
  if (searchQuery.trim()) {
    return (
      <>
        <Header />

        <LegendList
          data={filteredUsers}
          className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          contentContainerClassName="px-4 py-3"
          contentContainerStyle={{ gap: 16 }}
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
                  <SymbolView
                    name={
                      isEnabled
                        ? { ios: "bell.fill", android: "notifications", web: "notifications" }
                        : { ios: "bell.slash", android: "notifications_off", web: "notifications_off" }
                    }
                    size={24}
                    tintColor={tintColor}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </>
    );
  }

  // DEFAULT STATE - show only enabled runners
  return (
    <>
      <Header />
      <LegendList
        data={enabledRunners}
        className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]"
        keyExtractor={(item) => item.id}
        keyboardDismissMode="on-drag"
        contentContainerClassName="px-4 py-3"
        contentContainerStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item }) => {
          return (
            <NotificationPlayerCard
              uuid={item.id}
              nickname={item.nick}
              route={`/settings/notifications/runners/${item.id}`}
            />
          );
        }}
      />
    </>
  );
};
