import LoadingScreen from "@/components/LoadingScreen";
import { useEventListData } from "@/hooks/useEventListData";
import { FlatList, Text, View } from "react-native";

const EventsPage = () => {
  const { data: eventlist, isLoading } = useEventListData();
  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex flex-1 justify-center items-center bg-white dark:bg-[#111827]">
      <Text className="text-black dark:text-white">Settings Page</Text>
    </View>
  );
};

export default EventsPage;
