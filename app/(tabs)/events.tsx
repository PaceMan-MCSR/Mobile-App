import { FlatList, ScrollView, Text, View } from "react-native";
import { useEventListData } from "@/hooks/useEventListData";
import LoadingScreen from "@/components/LoadingScreen";
import test from "@/app/api/test.json";

const EventsPage = () => {
  const { data: eventlist, isLoading } = useEventListData();
  if (isLoading) return <LoadingScreen />;

  return (
    <View className="bg-white dark:bg-black">
      <FlatList
        data={eventlist}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Text className="text-black dark:text-white">{item.name}</Text>}
      />
    </View>
  );
};

export default EventsPage;
