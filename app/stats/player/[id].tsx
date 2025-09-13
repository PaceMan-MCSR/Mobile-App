import RunCard from "@/components/RunCard";
import ErrorScreen from "@/components/screens/ErrorScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import { useUserData } from "@/hooks/useUserData";
import { msToTime } from "@/lib/utils/frontendConverters";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";

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

  if (isError) {
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
