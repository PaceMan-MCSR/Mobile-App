import LoadingScreen from "@/components/LoadingScreen";
import { useEventListData } from "@/hooks/useEventListData";
import { FlatList, Text, View } from "react-native";

const EventsPage = () => {
  const { data: eventlist, isLoading } = useEventListData();
  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex flex-1 bg-white dark:bg-[#111827]">
      <FlatList
        data={eventlist}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Text className="text-black dark:text-white">{item.name}</Text>}
      />
    </View>
  );
};

export default EventsPage;
