import { useNotification } from "@/providers/notifications";
import { usePushToken } from "@/providers/notifications/hooks/api/use-push-tokens";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-token-for-runner";
import Slider from "@react-native-community/slider";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { ScrollView, Switch, Text, View } from "react-native";

const NotificationsPage = () => {
  const { expoPushToken } = useNotification();
  const { updateTokenMutation } = usePushToken();
  const { data: tokenSettings } = useSettingsForToken({ expoToken: expoPushToken || "" });
  const queryClient = useQueryClient();
  const router = useRouter();

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived values from token settings
  const paceLimit1_16_1 = tokenSettings?.paceLimit1_16_1;
  const isEnabled = paceLimit1_16_1 !== null && paceLimit1_16_1 !== undefined;
  const sliderValue = paceLimit1_16_1 ?? 12; // Default to 12 if not set

  console.log("[Render] Token settings:", {
    paceLimit1_16_1,
    isEnabled,
    sliderValue,
    hasTokenSettings: !!tokenSettings,
  });

  // Debounced update function for slider changes
  const debouncedUpdate = (value: number) => {
    if (!expoPushToken) {
      console.log("[Slider] No expo push token available");
      return;
    }

    console.log("[Slider] Debounced update triggered, value:", value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      console.log("[Slider] Cleared previous debounce timeout");
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      const queryKey = ["token-settings", expoPushToken];
      console.log("[Slider] Executing debounced API call with value:", value);

      // Optimistic update
      queryClient.setQueryData(queryKey, (old: any) => {
        console.log("[Slider] Optimistic update - old value:", old?.paceLimit1_16_1, "new value:", value);
        return {
          ...old,
          paceLimit1_16_1: value,
        };
      });

      updateTokenMutation.mutate(
        {
          expoToken: expoPushToken,
          paceLimit1_16_1: value,
        },
        {
          onError: (error) => {
            console.error("[Slider] Failed to update token:", error);
            // Rollback on error
            queryClient.invalidateQueries({ queryKey });
          },
          onSettled: () => {
            console.log("[Slider] Mutation settled, invalidating queries");
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey });
          },
        }
      );
    }, 1000);
  };

  // Immediate update function for switch changes
  const immediateUpdate = (enabled: boolean) => {
    if (!expoPushToken) {
      console.log("[Switch] No expo push token available");
      return;
    }

    const queryKey = ["token-settings", expoPushToken];
    const newPaceLimit = enabled ? sliderValue : null;
    console.log(
      "[Switch] Immediate update - enabled:",
      enabled,
      "newPaceLimit:",
      newPaceLimit,
      "current sliderValue:",
      sliderValue
    );

    // Optimistic update
    queryClient.setQueryData(queryKey, (old: any) => {
      console.log("[Switch] Optimistic update - old value:", old?.paceLimit1_16_1, "new value:", newPaceLimit);
      return {
        ...old,
        paceLimit1_16_1: newPaceLimit,
      };
    });

    console.log("[Switch] Calling API mutation with paceLimit1_16_1:", newPaceLimit ?? undefined);
    updateTokenMutation.mutate(
      {
        expoToken: expoPushToken,
        paceLimit1_16_1: newPaceLimit ?? undefined,
      },
      {
        onError: (error) => {
          console.error("[Switch] Failed to update token:", error);
          // Rollback on error
          queryClient.invalidateQueries({ queryKey });
        },
        onSettled: () => {
          console.log("[Switch] Mutation settled, invalidating queries");
          // Refetch to ensure consistency
          queryClient.invalidateQueries({ queryKey });
        },
      }
    );
  };

  // Handle switch change
  const handleSwitchChange = (value: boolean) => {
    console.log("[Switch] handleSwitchChange called with value:", value);
    immediateUpdate(value);
  };

  // Handle slider change
  const handleSliderChange = (value: number) => {
    console.log("[Slider] handleSliderChange called with value:", value);

    // Optimistically update the UI immediately for slider
    if (expoPushToken) {
      const queryKey = ["token-settings", expoPushToken];
      queryClient.setQueryData(queryKey, (old: any) => {
        console.log("[Slider] Immediate optimistic update - old value:", old?.paceLimit1_16_1, "new value:", value);
        return {
          ...old,
          paceLimit1_16_1: value,
        };
      });
    } else {
      console.log("[Slider] No expo push token for immediate update");
    }

    // Debounced API call
    debouncedUpdate(value);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View className="flex flex-1 bg-[#F2F2F2] dark:bg-[#111827]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-4" contentContainerClassName="gap-4">
        {/* PACE NOTIFICATIONS */}
        <View>
          <Text className="py-3 text-2xl font-bold text-black dark:text-[#ECEDEE]">Enable Pace Notifications</Text>
          <View className="gap-4 rounded-xl bg-[#DBDEE3] p-4 dark:bg-[#1F2937]">
            <View className="flex flex-row items-center">
              <Text className="flex flex-1 text-xl font-semibold text-black dark:text-[#ECEDEE]">1.16.1</Text>
              <Switch
                value={isEnabled}
                onValueChange={handleSwitchChange}
                trackColor={{ false: "#767577", true: "#34C759" }}
                thumbColor="#FFFFFF"
              />
            </View>
            {isEnabled && (
              <View className="gap-2">
                <Text className="text-lg font-semibold text-black dark:text-[#ECEDEE]">Pace Limit: {sliderValue}</Text>
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={8}
                  maximumValue={13}
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  minimumTrackTintColor="#34C759"
                  maximumTrackTintColor="#DBDEE3"
                  thumbTintColor="#34C759"
                  step={1}
                />
              </View>
            )}
          </View>
        </View>

        {/* RUNNER NOTIFICATIONS LINK */}
        <Text
          onPress={() => {
            router.push("/(tabs)/settings/notifications/runners");
          }}
          className="text-xl text-white underline"
        >
          Enable Runner Notifications
        </Text>
      </ScrollView>
    </View>
  );
};

export default NotificationsPage;
