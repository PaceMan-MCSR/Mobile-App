import { View, Text, FlatList } from "react-native";
import { Link, Stack } from "expo-router";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useUserData } from "@/hooks/useUserData";
import LoadingScreen from "@/components/LoadingScreen";
import RunCard from "@/components/RunCard";
import { Image } from "expo-image";
import { msToTime } from "@/lib/utils/frontendConverters";
import { Ionicons } from "@expo/vector-icons";

const StatsPlayerPage = () => {
  const { id: name } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useUserData({ name });
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
      <View className="flex flex-1 bg-background-primary">
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          data={completions}
          ListHeaderComponent={() => (
            <View className="m-4 gap-3">
              <View className="p-4 bg-background-secondary rounded-xl gap-4">
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
                  <Link href={`/stats/run/${allTime.uuid}`} push asChild>
                    <Text className="text-text-primary text-xl font-semibold">
                      Personal Best: {msToTime(allTime.time)}
                    </Text>
                  </Link>
                )}
                {daily && (
                  <Link href={`/stats/run/${daily.uuid}`} push asChild>
                    <Text className="text-text-primary text-md font-semibold">Daily Best: {msToTime(daily.time)}</Text>
                  </Link>
                )}
                {weekly && (
                  <Link href={`/stats/run/${weekly.uuid}`} push asChild>
                    <Text className="text-text-primary text-md font-semibold">
                      Weekly Best: {msToTime(weekly.time)}
                    </Text>
                  </Link>
                )}
                {monthly && (
                  <Link href={`/stats/run/${monthly.uuid}`} push asChild>
                    <Text className="text-text-primary text-md font-semibold">
                      Monthly Best: {msToTime(monthly.time)}
                    </Text>
                  </Link>
                )}
              </View>
              <Text className="text-text-primary text-2xl font-bold py-3">{name}'s Completions</Text>
              <View className="flex flex-row w-full items-center">
                <Text className="flex min-w-10 text-text-primary text-xl font-black">#</Text>
                <Text className="flex flex-1 text-text-primary text-xl font-black">Time</Text>
                <Text className="text-text-primary text-xl font-black">Submitted</Text>
              </View>
            </View>
          )}
          renderItem={({ item, index }) => (
            <RunCard index={index} uuid={item.uuid} time={item.time} submitted={item.submitted} />
          )}
        />
      </View>
    </>
  );
};

export default StatsPlayerPage;
