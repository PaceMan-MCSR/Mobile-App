import liveruns from "@/data/liveruns.json";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View } from "react-native";
import PaceCard from "@/components/PaceCard";

const HomePage = () => {
  // const { data: liveruns, isLoading } = useQuery({
  //   queryKey: ["liveruns"],
  //   queryFn: () => fetch("/api/liveruns").then((res) => res.json()),
  //   refetchInterval: 1000,
  // });
  // if (isLoading) return <ThemedText>Loading...</ThemedText>;

  return (
    <View className="bg-white dark:bg-black">
      <FlatList
        contentContainerClassName="px-4 py-3"
        data={liveruns}
        keyExtractor={(item: any) => item.worldId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PaceCard
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
