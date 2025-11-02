import { useMutation } from "@tanstack/react-query";

const pushNotificationsServiceURL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

export interface RegisterTokenParams {
  expoToken: string;
  deviceType?: "ios" | "android";
}

export interface RegisterTokenResponse {
  message: string;
  id: number;
}

export async function registerToken({ expoToken, deviceType }: RegisterTokenParams): Promise<RegisterTokenResponse> {
  const response = await fetch(`${pushNotificationsServiceURL}/api/token/register-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expoToken,
      deviceType,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to register token");
  }

  return response.json();
}

interface UpdateTokenParams {
  expoToken: string;
  paceLimit1_16_1?: number;
  paceLimit1_15_2?: number | null;
  paceLimit1_7_10?: number | null;
}

interface UpdateTokenResponse {
  message: string;
  expoToken: string;
}

export const usePushToken = () => {
  const registerTokenMutation = useMutation<RegisterTokenResponse, Error, RegisterTokenParams>({
    mutationFn: registerToken,
  });

  const updateTokenMutation = useMutation<UpdateTokenResponse, Error, UpdateTokenParams>({
    mutationFn: async ({ expoToken, paceLimit1_16_1, paceLimit1_15_2, paceLimit1_7_10 }) => {
      const response = await fetch(`${pushNotificationsServiceURL}/api/token/update-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoToken,
          ...(paceLimit1_16_1 !== undefined && { paceLimit1_16_1 }),
          ...(paceLimit1_15_2 !== undefined && { paceLimit1_15_2: paceLimit1_15_2 ?? null }),
          ...(paceLimit1_7_10 !== undefined && { paceLimit1_7_10: paceLimit1_7_10 ?? null }),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to update token");
      }

      return response.json();
    },
  });

  return {
    registerTokenMutation,
    updateTokenMutation,
  };
};
