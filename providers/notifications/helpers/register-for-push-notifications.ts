import { storage } from "@/lib/utils/mmkv";
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
    console.log(`[${Platform.OS}] - ${existingStatus}`);
    let finalStatus = existingStatus;

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
      const expoToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      // Check MMKV storage for existing token registration
      const storedTokenData = storage.getString("notifications-token-registered");
      console.log(`[${Platform.OS}] - ${JSON.stringify(storedTokenData)}`);
      let shouldRegister = false;

      if (storedTokenData) {
        try {
          const parsedData = JSON.parse(storedTokenData);
          if (!parsedData.registered || parsedData.token !== expoToken) {
            shouldRegister = true;
          } else {
            console.log(`[${Platform.OS}] - Already registered, don't hit API`);
          }
        } catch (error) {
          console.error(`[${Platform.OS}] - Failed to parse stored token data: ${error}`);
          shouldRegister = true;
        }
      } else {
        shouldRegister = true;
      }

      // Make API call if we need to register the token
      if (shouldRegister && finalStatus === "granted") {
        console.log(`[${Platform.OS}] - Registering token with server`);
        try {
          const data = await registerTokenMutation.mutateAsync({
            expoToken,
            deviceType: Platform.OS as "ios" | "android",
          });
          console.log("API response:", data);

          const tokenRegistrationData = {
            registered: true,
            token: expoToken,
          };
          storage.set("notifications-token-registered", JSON.stringify(tokenRegistrationData));
        } catch (error) {
          console.error(`[${Platform.OS}] - Failed to register push token with server: ${error}`);
          throw error;
        }
      }
      console.log(`[${Platform.OS}] - ${expoToken}`);
      return expoToken;
    } catch (e: unknown) {
      throw new Error(`${e}`);
    }
  } else {
    throw new Error("Must use physical device for push notifications");
  }
}
