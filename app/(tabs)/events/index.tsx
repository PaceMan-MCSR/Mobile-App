import { ScrollView } from "react-native";
import { ThemedText, ThemedView } from "@/components/ThemedComponents";

const EventsPage = () => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ThemedView>
        <ThemedText>EventsPage</ThemedText>
      </ThemedView>
    </ScrollView>
  );
};

export default EventsPage;
