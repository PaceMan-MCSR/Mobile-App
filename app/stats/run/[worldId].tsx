import ErrorScreen from "@/components/screens/error-screen";
import LoadingScreen from "@/components/screens/loading-screen";
import TwitchButton from "@/components/twitch-button";
import { useRunData } from "@/hooks/api/use-run-data";
import { getSortedEventsWithTimes, msToTime } from "@/lib/utils/frontend-converters";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const StatsRunPage = () => {
  const { worldId, searchQueriedNickname } = useLocalSearchParams<{ worldId: string; searchQueriedNickname: string }>();
  const { data, isError, isLoading } = useRunData({ worldId });

  const splits = useMemo(() => {
    if (!data?.eventList) return [];
    const completedEvents = new Map(data.eventList.map((event) => [event.name, event.time]));
    return getSortedEventsWithTimes(completedEvents);
  }, [data]);

  const router = useRouter();

  if (isLoading)
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: searchQueriedNickname ?? "Loading...",
          }}
        />
        <LoadingScreen />
      </>
    );

  if (isError || !data)
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: searchQueriedNickname ?? "Unknown Run",
          }}
        />
        <ErrorScreen />
      </>
    );

  const { uuid, twitch, isLive, nickname, vodId, vodOffset } = data;
  const lastCompletedSplit = [...splits].reverse().find((split) => split.splitTime !== "N/A");
  const hasFinished = lastCompletedSplit?.splitName === "Finish";

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: nickname ?? searchQueriedNickname ?? "Unknown Run",
        }}
      />
      <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          data={splits}
          contentContainerClassName="m-4"
          ListHeaderComponent={() => (
            <>
              {/* PLAYER AVATAR + NAME + TWITCH BUTTON */}
              <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
                <View className="flex flex-row items-center gap-4">
                  <TouchableOpacity activeOpacity={0.5} onPress={() => router.push(`/stats/player/${nickname}`)}>
                    <Image
                      cachePolicy={"memory"}
                      source={{ uri: `https://mc-heads.net/avatar/${uuid}` }}
                      style={{ height: 50, width: 50 }}
                    />
                  </TouchableOpacity>
                  <View className="flex flex-1">
                    <View className="flex flex-row items-center gap-2">
                      <TouchableOpacity activeOpacity={0.5} onPress={() => router.push(`/stats/player/${nickname}`)}>
                        <Text
                          numberOfLines={1}
                          className="max-w-full truncate text-2xl font-bold text-black dark:text-white"
                        >
                          {nickname}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {isLive && !hasFinished && (
                      <View className="flex flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-red-500">In Progress</Text>
                      </View>
                    )}
                    {!isLive && !hasFinished && (
                      <View className="flex flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-black dark:text-white">Reset</Text>
                      </View>
                    )}
                    {hasFinished && (
                      <View className="flex flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-green-500">Completed</Text>
                      </View>
                    )}
                  </View>
                  <TwitchButton twitch={twitch} vodId={!isLive ? vodId : null} vodOffset={!isLive ? vodOffset : null} />
                </View>
              </View>

              <Text className="py-4 text-2xl font-bold text-black dark:text-[#ECEDEE]">Splits</Text>
            </>
          )}
          renderItem={({ item, index }) => {
            const { splitName, splitTime } = item;
            const isCompleted = splitTime !== "N/A";
            const isLastCompleted = lastCompletedSplit?.splitName === splitName;
            const isFirst = index === 0;
            const isLast = index === splits.length - 1;

            return (
              <View
                className={`bg-[#DBDEE3] dark:bg-[#1F2937] ${isFirst ? "rounded-t-xl" : isLast ? "rounded-b-xl" : ""}`}
              >
                <View
                  className={`flex flex-row items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-gray-700 ${
                    isLastCompleted && isLive ? "bg-green-500/20 dark:bg-green-500/10" : ""
                  } ${isLast ? "border-b-0" : ""}`}
                >
                  <View className="flex flex-1">
                    <Text
                      className={`text-lg font-semibold ${
                        isCompleted ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {splitName}
                    </Text>
                  </View>
                  <Text
                    className={`text-xl font-bold ${
                      isCompleted ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {isCompleted ? msToTime(splitTime) : "--:--"}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </>
  );
};

export default StatsRunPage;
