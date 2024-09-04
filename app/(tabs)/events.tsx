import { ScrollView, Text, View } from "react-native";

const EventsPage = () => {
  return (
    <View className="flex flex-1 bg-white dark:bg-black items-center justify-center">
      <ScrollView className="flex flex-1 w-full" contentInsetAdjustmentBehavior="automatic">
        <Text className="text-black dark:text-white">EventsPage</Text>
      </ScrollView>
    </View>
  );
};

export default EventsPage;
