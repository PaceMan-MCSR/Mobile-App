import { ScrollView } from "react-native";
import { ThemedText, ThemedView } from "@/components/ThemedComponents";

const HomePage = () => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ThemedView>
        <ThemedText>PaceMan</ThemedText>
      </ThemedView>
    </ScrollView>
  );
};

export default HomePage;
