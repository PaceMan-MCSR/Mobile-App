import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View } from "react-native";
import PaceCard from "@/components/PaceCard";
import { useLiverunsData } from "@/hooks/useLiverunsData";
import LoadingScreen from "@/components/LoadingScreen";

const HomePage = () => {
  const { data: liveruns, isLoading } = useLiverunsData();

  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex flex-1 bg-white dark:bg-[#111827]">
      <FlatList
        contentContainerClassName="flex flex-1 px-4 py-3"
        data={liveruns}
        keyExtractor={(item: any) => item.worldId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <PaceCard
            index={index}
            key={item.worldId}
            user={item.user}
            worldId={item.worldId}
            eventList={item.eventList}
            contextEventList={item.contextEventList}
            isCheated={item.isCheated}
            isHidden={item.isHidden}
            lastUpdated={item.lastUpdated}
            nickname={item.nickname}
          />
        )}
      />
    </View>
  );
};

export default HomePage;
