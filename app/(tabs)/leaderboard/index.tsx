import { ScrollView } from "react-native";
import { ThemedText, ThemedView } from "@/components/ThemedComponents";

const LeaderboardPage = () => {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ThemedView>
        <ThemedText>LeaderboardPage</ThemedText>
      </ThemedView>
    </ScrollView>
  );
};

export default LeaderboardPage;
