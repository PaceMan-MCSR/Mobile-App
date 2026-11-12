import { isDeviceEligibleForNotifications } from "@/lib/utils/frontend-converters";
import { RegisterTokenParams, RegisterTokenResponse } from "@/providers/notifications/hooks/api/use-register-token";
import { QueryClient, UseMutationResult } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { getItemAsync } from "expo-secure-store";
import { Platform } from "react-native";

export const registerForPushNotifications = async (
  mutation: UseMutationResult<RegisterTokenResponse, Error, RegisterTokenParams>,
  queryClient: QueryClient
) => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (isDeviceEligibleForNotifications) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === "granted") {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }

      try {
        const { expoToken, deviceToken, cachedExpoToken, cachedDeviceToken } = await queryClient.fetchQuery({
          queryKey: ["push-tokens", projectId],
          queryFn: async () => {
            const [expoTokenResult, deviceTokenResult, cachedExpoToken, cachedDeviceToken] = await Promise.all([
              Notifications.getExpoPushTokenAsync({ projectId }),
              Notifications.getDevicePushTokenAsync(),
              getItemAsync("cached-expo-token"),
              getItemAsync("cached-device-token"),
            ]);
            return {
              expoToken: expoTokenResult.data,
              deviceToken: deviceTokenResult.data,
              cachedExpoToken,
              cachedDeviceToken,
            };
          },
          retry: 2,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        });

        const isTokenCacheEmpty = cachedExpoToken === null && cachedDeviceToken === null;
        const tokensChanged = cachedExpoToken !== expoToken || cachedDeviceToken !== deviceToken;

        if (isTokenCacheEmpty || tokensChanged) {
          try {
            await mutation.mutateAsync({
              expoToken,
              deviceToken,
              deviceType: Platform.OS as "ios" | "android",
              cachedExpoToken: cachedExpoToken || undefined,
              cachedDeviceToken: cachedDeviceToken || undefined,
            });
          } catch (error: any) {
            // If token not found, cache was cleared - retry registration with fresh tokens
            if (error?.message === "TOKEN_NOT_FOUND" || error?.tokenNotFound) {
              try {
                // Retry registration - cache is already cleared, so this will force fresh registration
                await mutation.mutateAsync({
                  expoToken,
                  deviceToken,
                  deviceType: Platform.OS as "ios" | "android",
                });
              } catch (retryError) {
                throw retryError;
              }
            } else {
              throw error;
            }
          }
        }
        return { expoToken, deviceToken, finalStatus };
      } catch (e: unknown) {
        throw new Error(`${e}`);
      }
    } else {
      throw new Error("Permission not granted to get push token for push notification!");
    }
  } else {
    throw new Error("Only physical iOS and Android devices are eligible for notifications.");
  }
};
