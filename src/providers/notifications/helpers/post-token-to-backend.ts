/* 
Handler to push the Expo Token and Device Token to PushNotificationsService.
*/
import { getIntegrityHeaders } from "@/providers/notifications/helpers/get-integrity-headers";

const PUSH_NOTIFICATIONS_SERVICE_URL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

export interface RegisterTokenParams {
  expoToken: string;
  deviceToken: string;
  deviceType?: "ios" | "android";
  cachedExpoToken?: string | null;
  cachedDeviceToken?: string | null;
}

export async function postTokenToBackend({
  expoToken,
  deviceToken,
  deviceType,
  cachedExpoToken,
  cachedDeviceToken,
}: RegisterTokenParams): Promise<Response> {
  const body = JSON.stringify({
    expoToken,
    deviceToken,
    deviceType,
  });

  const integrityHeaders = await getIntegrityHeaders(expoToken, deviceToken);

  // Add cached tokens as headers if provided
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...integrityHeaders,
    ...(cachedExpoToken && { "x-cached-expo-token": cachedExpoToken }),
    ...(cachedDeviceToken && { "x-cached-device-token": cachedDeviceToken }),
  };

  const response = await fetch(`${PUSH_NOTIFICATIONS_SERVICE_URL}/api/pns/token/register-token`, {
    method: "POST",
    headers,
    body,
  });
  return response;
}
