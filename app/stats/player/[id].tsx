import RunCard from "@/components/run-card";
import ErrorScreen from "@/components/screens/error-screen";
import LoadingScreen from "@/components/screens/loading-screen";
import { useUserData } from "@/hooks/api/use-user-data";
import { msToTime } from "@/lib/utils/frontend-converters";
import { useSettingsForToken, useTokenForRunner } from "@/providers/notifications/hooks/api/use-token-for-runner";

import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";

const StatsPlayerPage = () => {
  const { id: name } = useLocalSearchParams<{ id: string }>();
  const { data, refetch, isLoading, isError, isRefetching } = useUserData({ name });
  const { data: notificationSettings, isLoading: isLoadingNotificationSettings } = useSettingsForToken();
  const { runners = [] } = notificationSettings || {};
  const { addTokenForRunnerMutation, deleteTokenForRunnerMutation } = useTokenForRunner();

  // Compute enableNotifications if we have both user data and notification settings
  const userUuid = data?.user?.uuid;
  const enableNotifications = userUuid ? runners.includes(userUuid) : false;

  // Show loading indicator if user data is loading OR notification settings are loading OR we don't have uuid yet
  const isRunnerNotificationStateLoading = isLoading || isLoadingNotificationSettings || !userUuid;

  const toggleRunnerNotification = (runnerId: string, runnerNick: string) => {
    const isEnabled = runners.includes(runnerId);

    if (isEnabled) {
      deleteTokenForRunnerMutation.mutate({ runnerId });
    } else {
      addTokenForRunnerMutation.mutate({ runnerId });
    }
  };

  // Header right component for bell icon
  const renderHeaderRight = () => {
    if (isRunnerNotificationStateLoading || !userUuid) return null;

    return (
      <Pressable
        onPress={() => toggleRunnerNotification(userUuid, name)}
        style={{
          margin: 6,
        }}
      >
        <SymbolView name={enableNotifications ? "bell.fill" : "bell.slash"} tintColor={"white"} />
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: name,
            headerRight: renderHeaderRight,
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
            headerTitle: name,
            headerRight: renderHeaderRight,
          }}
        />
        <ErrorScreen />
      </>
    );
  }

  const { user, pbs, completions } = data!;
  const { daily, monthly, weekly, allTime } = pbs;
  const { uuid } = user;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: name,
          headerRight: renderHeaderRight,
        }}
      />
      <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          data={completions}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListHeaderComponent={() => (
            <View className="m-4 gap-3">
              <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
                <View className="flex flex-row items-center gap-4">
                  <Image
                    source={`https://mc-heads.net/avatar/${uuid}`}
                    style={{ height: 50, width: 50 }}
                    placeholder={require("@/assets/images/placeholder.png")}
                  />
                  <Text numberOfLines={1} className="max-w-full truncate text-2xl font-bold text-black dark:text-white">
                    {name}
                  </Text>
                </View>
                {allTime && (
                  <Text className="text-xl font-semibold text-black dark:text-[#ECEDEE]">
                    Personal Best: {msToTime(allTime.time)}
                  </Text>
                )}
                {daily && (
                  <Text className="text-md font-semibold text-black dark:text-[#ECEDEE]">
                    Daily Best: {msToTime(daily.time)}
                  </Text>
                )}
                {weekly && (
                  <Text className="text-md font-semibold text-black dark:text-[#ECEDEE]">
                    Weekly Best: {msToTime(weekly.time)}
                  </Text>
                )}
                {monthly && (
                  <Text className="text-md font-semibold text-black dark:text-[#ECEDEE]">
                    Monthly Best: {msToTime(monthly.time)}
                  </Text>
                )}
              </View>
              {completions.length ? (
                <>
                  <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">{`${name}'s Completions`}</Text>
                  <View className="flex w-full flex-row items-center">
                    <Text className="flex min-w-10 text-xl font-black text-black dark:text-[#ECEDEE]">#</Text>
                    <Text className="flex flex-1 text-xl font-black text-black dark:text-[#ECEDEE]">Time</Text>
                    <Text className="text-xl font-black text-black dark:text-[#ECEDEE]">Submitted</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">
                    {name} does not have any completions.
                  </Text>
                </>
              )}
            </View>
          )}
          renderItem={({ item, index }) => <RunCard index={index} time={item.time} submitted={item.submitted} />}
        />
      </View>
    </>
  );
};

export default StatsPlayerPage;
