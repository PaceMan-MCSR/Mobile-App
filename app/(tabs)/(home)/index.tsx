import { ThemedText, ThemedView } from "@/components/ThemedComponents";
import liveruns from "@/data/liveruns.json";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";
import PaceCard from "@/components/PaceCard";

const HomePage = () => {
  // const { data: liveruns, isLoading } = useQuery({
  //   queryKey: ["liveruns"],
  //   queryFn: () => fetch("/api/liveruns").then((res) => res.json()),
  //   refetchInterval: 1000,
  // });
  // if (isLoading) return <ThemedText>Loading...</ThemedText>;

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
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
    </ThemedView>
  );
};

export default HomePage;
