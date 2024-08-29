import { ThemedText, ThemedView } from "@/components/ThemedComponents";
import liveruns from "@/data/liveruns.json";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";

const HomePage = () => {
  // const { data: liveruns, isLoading } = useQuery({
  //   queryKey: ["liveruns"],
  //   queryFn: () => fetch("/api/liveruns").then((res) => res.json()),
  //   refetchInterval: 1000,
  // });
  // if (isLoading) return <ThemedText>Loading...</ThemedText>;

  return (
    <ThemedView style={{ alignItems: "center", width: "100%", flex: 1 }}>
      <FlatList
        data={liveruns}
        keyExtractor={(item: any) => item.worldId}
        renderItem={({ item }) => <ThemedText>{item.nickname}</ThemedText>}
      />
    </ThemedView>
  );
};

export default HomePage;
