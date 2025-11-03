import { useNotification } from "@/providers/notifications";
import { usePushToken } from "@/providers/notifications/hooks/api/use-push-tokens";
import { useTokenForRunner } from "@/providers/notifications/hooks/api/use-token-for-runner";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

const RUNNER_ID = "0089fb5e-fd97-4c0b-be3a-40a942631742";

const NotificationsTestPage = () => {
  const { expoPushToken } = useNotification();
  const { updateTokenMutation } = usePushToken();
  const { addTokenForRunnerMutation, deleteTokenForRunnerMutation } = useTokenForRunner();

  const handleUpdateToken = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "Expo push token not available");
      return;
    }

    try {
      const result = await updateTokenMutation.mutateAsync({
        expoToken: expoPushToken,
        paceLimit1_16_1: 10,
        paceLimit1_15_2: null,
        paceLimit1_7_10: null,
      });
      Alert.alert("Success", `Token updated: ${result.message}`);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update token");
    }
  };

  const handleAddTokenForRunner = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "Expo push token not available");
      return;
    }

    try {
      const result = await addTokenForRunnerMutation.mutateAsync({
        expoToken: expoPushToken,
        runnerId: RUNNER_ID,
      });
      Alert.alert("Success", `Runner added: ${result.message}`);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to add token for runner");
    }
  };

  const handleDeleteTokenForRunner = async () => {
    if (!expoPushToken) {
      Alert.alert("Error", "Expo push token not available");
      return;
    }

    try {
      const result = await deleteTokenForRunnerMutation.mutateAsync({
        expoToken: expoPushToken,
        runnerId: RUNNER_ID,
      });
      Alert.alert("Success", `Runner removed: ${result.message}`);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to delete token for runner");
    }
  };

  return (
    <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4" contentContainerClassName="gap-4 py-4">
        <View>
          <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Notification API Tests</Text>
          <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
            <View className="gap-2">
              <Text className="text-lg font-semibold text-black dark:text-[#ECEDEE]">Expo Push Token</Text>
              <Text className="text-sm text-black dark:text-[#ECEDEE]" numberOfLines={2}>
                {expoPushToken || "Not available"}
              </Text>
            </View>
            <View className="gap-2">
              <Text className="text-lg font-semibold text-black dark:text-[#ECEDEE]">Runner ID</Text>
              <Text className="text-sm text-black dark:text-[#ECEDEE]">{RUNNER_ID}</Text>
            </View>
          </View>
        </View>

        {/* Update Token */}
        <View>
          <Text className="py-3 text-xl font-bold text-black dark:text-[#ECEDEE]">Update Token</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleUpdateToken}
            disabled={updateTokenMutation.isPending || !expoPushToken}
            className={`rounded-xl bg-blue-500 p-4 ${updateTokenMutation.isPending || !expoPushToken ? "opacity-50" : ""}`}
          >
            <Text className="text-center text-lg font-bold text-white">
              {updateTokenMutation.isPending ? "Updating..." : "Update Token"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Token For Runner */}
        <View>
          <Text className="py-3 text-xl font-bold text-black dark:text-[#ECEDEE]">Add Token For Runner</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleAddTokenForRunner}
            disabled={addTokenForRunnerMutation.isPending || !expoPushToken}
            className={`rounded-xl bg-green-500 p-4 ${addTokenForRunnerMutation.isPending || !expoPushToken ? "opacity-50" : ""}`}
          >
            <Text className="text-center text-lg font-bold text-white">
              {addTokenForRunnerMutation.isPending ? "Adding..." : "Add Token For Runner"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delete Token For Runner */}
        <View>
          <Text className="py-3 text-xl font-bold text-black dark:text-[#ECEDEE]">Delete Token For Runner</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleDeleteTokenForRunner}
            disabled={deleteTokenForRunnerMutation.isPending || !expoPushToken}
            className={`rounded-xl bg-red-500 p-4 ${deleteTokenForRunnerMutation.isPending || !expoPushToken ? "opacity-50" : ""}`}
          >
            <Text className="text-center text-lg font-bold text-white">
              {deleteTokenForRunnerMutation.isPending ? "Deleting..." : "Delete Token For Runner"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationsTestPage;
