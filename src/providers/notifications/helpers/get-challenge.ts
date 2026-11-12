/* 
Handler to get challenge/nonce to perform integrity check against.
*/
import { Platform } from "react-native";

const PUSH_NOTIFICATIONS_SERVICE_URL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

export const getChallenge = async (expoToken: string): Promise<string> => {
  const response = await fetch(`${PUSH_NOTIFICATIONS_SERVICE_URL}/api/pns/challenge/`, {
    method: "GET",
    headers: {
      "x-platform": Platform.OS,
      "x-expo-token": expoToken,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to obtain challenge");
  }

  const data: { challenge: string } = await response.json();
  return data.challenge;
};
