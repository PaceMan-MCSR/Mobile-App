import { FlatList, ScrollView, Text, View } from "react-native";
import { useEventListData } from "@/hooks/useEventListData";
import LoadingScreen from "@/components/LoadingScreen";

const EventsPage = () => {
  const { data: eventlist, isLoading } = useEventListData();
  if (isLoading) return <LoadingScreen />;

  return (
    <View className="bg-white dark:bg-[#111827]">
      <FlatList
        data={eventlist}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Text className="text-black dark:text-white">{item.name}</Text>}
      />
    </View>
  );
};

export default EventsPage;
