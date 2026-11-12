/* 
Handler for handling specific Integrity Errors to re-publish tokens.
[409] Conflict in Apple App Attest key.
- Delete App Attest Key
- Generate New Attestation

[404] Push token not found.
- Delete expoToken and deviceToken from cache.
- Delete App Attest Key
- Generate New Attestation
*/
import { postTokenToBackend } from "@/providers/notifications/helpers/post-token-to-backend";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { deleteItemAsync } from "expo-secure-store";
import { Platform } from "react-native";

export const handleIntegrityError = async (response: Response): Promise<{ tokenNotFound: boolean }> => {
  let tokenNotFound = false;

  const responseClone = response.clone();
  let errorMessage = "";

  try {
    const errorData = await responseClone.json().catch(() => ({}));
    errorMessage = errorData?.error || "";
  } catch {}

  // Check for attestation conflict errors - [409] "Conflict in Apple App Attest key."
  if (response.status === 409 && Platform.OS === "ios" && errorMessage === "Conflict in Apple App Attest key.") {
    try {
      await deleteItemAsync("app-attest-key");
    } catch {}
  }

  // Check for token not found errors - [404] "Push token not found."
  if (response.status === 404 && errorMessage === "Push token not found.") {
    await Promise.all([
      deleteItemAsync("cached-expo-token").catch(() => {}),
      deleteItemAsync("cached-device-token").catch(() => {}),
      Platform.OS === "ios" ? deleteItemAsync("app-attest-key").catch(() => {}) : Promise.resolve(),
    ]);
    tokenNotFound = true;

    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      if (projectId) {
        const [expoTokenResult, deviceTokenResult] = await Promise.all([
          Notifications.getExpoPushTokenAsync({ projectId }),
          Notifications.getDevicePushTokenAsync(),
        ]);

        const reRegisterResponse = await postTokenToBackend({
          expoToken: expoTokenResult.data,
          deviceToken: deviceTokenResult.data,
          deviceType: Platform.OS as "ios" | "android",
        });

        if (!reRegisterResponse.ok) {
          console.error("Failed to re-register token after deletion");
        }
      }
    } catch (error) {
      console.error("Failed to re-register token after deletion:", error);
    }
  }
  return { tokenNotFound };
};
