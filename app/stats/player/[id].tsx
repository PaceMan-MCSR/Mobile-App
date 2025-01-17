import { View, Text, FlatList } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useUserData } from "@/hooks/useUserData";
import LoadingScreen from "@/components/screens/LoadingScreen";
import RunCard from "@/components/RunCard";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import ErrorScreen from "@/components/screens/ErrorScreen";

const StatsPlayerPage = () => {
  const { id: name } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError } = useUserData({ name });

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: name,
          }}
        />
        <LoadingScreen />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: name,
          }}
        />
        <ErrorScreen />
      </>
    );
  }

  const { user, pbs, completions } = data!;

  const { daily, monthly, weekly, allTime } = pbs;
  const { uuid } = user;
  const {} = completions;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: name,
        }}
      />
      <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          data={completions}
          ListHeaderComponent={() => (
            <View className="m-4 gap-3">
              <View className="p-4 bg-[#DBDEE3] dark:bg-[#1F2937] rounded-xl gap-4">
                <View className="flex flex-row items-center gap-4">
                  <Image
                    source={`https://mc-heads.net/avatar/${uuid}`}
                    style={{ height: 50, width: 50 }}
                    placeholder={require("@/assets/images/placeholder.png")}
                  />
                  <Text numberOfLines={1} className="text-black dark:text-white text-2xl font-bold max-w-full truncate">
                    {name}
                  </Text>
                </View>
                {allTime && (
                  <Text className="text-black dark:text-[#ECEDEE] text-xl font-semibold">
                    Personal Best: {msToTime(allTime.time)}
                  </Text>
                )}
                {daily && (
                  <Text className="text-black dark:text-[#ECEDEE] text-md font-semibold">
                    Daily Best: {msToTime(daily.time)}
                  </Text>
                )}
                {weekly && (
                  <Text className="text-black dark:text-[#ECEDEE] text-md font-semibold">
                    Weekly Best: {msToTime(weekly.time)}
                  </Text>
                )}
                {monthly && (
                  <Text className="text-black dark:text-[#ECEDEE] text-md font-semibold">
                    Monthly Best: {msToTime(monthly.time)}
                  </Text>
                )}
              </View>
              {completions.length ? (
                <>
                  <Text className="text-black dark:text-[#ECEDEE] text-2xl font-bold py-3">{name}'s Completions</Text>
                  <View className="flex flex-row w-full items-center">
                    <Text className="flex min-w-10 text-black dark:text-[#ECEDEE] text-xl font-black">#</Text>
                    <Text className="flex flex-1 text-black dark:text-[#ECEDEE] text-xl font-black">Time</Text>
                    <Text className="text-black dark:text-[#ECEDEE] text-xl font-black">Submitted</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-black dark:text-[#ECEDEE] text-2xl font-bold py-3">
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
