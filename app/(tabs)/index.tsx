import PaceCard from "@/components/PaceCard";
import LoadingScreen from "@/components/LoadingScreen";
import { Pace } from "@/lib/types/Pace";
import { FlatList, Text, View } from "react-native";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import PaceBottomSheet from "@/components/PaceBottomSheet";

const HomePage = () => {
  const { data: liveruns, isLoading } = useLiverunsData();

  if (isLoading) return <LoadingScreen />;

  if (!liveruns.length)
    return (
      <View className="flex flex-1 items-center justify-center bg-white dark:bg-[#111827]">
        <Text className="text-black dark:text-white text-lg">No one is currently on pace...</Text>
      </View>
    );

  return (
    <>
      <View className="flex flex-1 bg-white dark:bg-[#111827]">
        <FlatList
          contentContainerClassName="px-4 py-3"
          data={liveruns}
          keyExtractor={(item: Pace) => item.worldId}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            // FIXME: Aintnoway I need to pass all the data 😭 fix the props of <PaceCard />
            <PaceCard
              gameVersion={item.gameVersion}
              itemData={item.itemData}
              key={item.worldId}
              user={item.user}
              worldId={item.worldId}
              eventList={item.eventList}
              contextEventList={item.contextEventList}
              isCheated={item.isCheated}
              nickname={item.nickname}
              isHidden={item.isHidden}
              lastUpdated={item.lastUpdated}
            />
          )}
        />
      </View>
      {/* <PaceBottomSheet /> */}
    </>
  );
};

export default HomePage;
