import { RegisterTokenParams, RegisterTokenResponse } from "@/providers/notifications/hooks/api/use-push-tokens";
import { UseMutationResult } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotifications(
  registerTokenMutation: UseMutationResult<RegisterTokenResponse, Error, RegisterTokenParams>
) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    const wasFirstTimeGrant = existingStatus !== "granted"; // Track if we need to request

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error("Permission not granted to get push token for push notification!");
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      // Make API call if permissions were just granted (first time)
      if (wasFirstTimeGrant && finalStatus === "granted") {
        console.log("First time permission grant, pushing token to DB");
        registerTokenMutation
          .mutateAsync({
            expoToken: pushTokenString,
            deviceType: Platform.OS === "ios" || Platform.OS === "android" ? Platform.OS : undefined,
          })
          .then((data) => {
            console.log("API response:", data);
          })
          .catch((error) => {
            console.error("Failed to register push token with server:", error);
          });
      }
      console.log(`[${Platform.OS}] - ${pushTokenString}`);
      return pushTokenString;
    } catch (e: unknown) {
      throw new Error(`${e}`);
    }
  } else {
    throw new Error("Must use physical device for push notifications");
  }
}
