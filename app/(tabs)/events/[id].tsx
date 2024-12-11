import LoadingScreen from "@/components/LoadingScreen";
import { useEventListData } from "@/hooks/useEventListData";
import { FlatList, Text, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

const EventsPage = () => {
  const headerHeight = Math.ceil(useHeaderHeight());
  const { data: eventlist, isLoading } = useEventListData();
  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex flex-1 bg-white dark:bg-[#111827]">
      <FlatList
        style={{ paddingTop: headerHeight }}
        data={eventlist}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Text className="text-black dark:text-white">{item.name}</Text>}
      />
    </View>
  );
};

export default EventsPage;
