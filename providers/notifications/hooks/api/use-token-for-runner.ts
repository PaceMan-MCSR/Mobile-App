import { useMutation, useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

const pushNotificationsServiceURL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

interface TokenForRunnerParams {
  expoToken: string;
  runnerId: string;
}

interface TokenForRunnerResponse {
  message: string;
  runnerId: string;
  expoToken: string;
}

interface TokenSettingsResponse {
  paceLimit1_16_1: number;
  paceLimit1_15_2: number;
  paceLimit1_7_10: number;
  runners: string[];
}

interface GetSettingsForTokenParams {
  expoToken: string;
}

export const useTokenForRunner = () => {
  const addTokenForRunnerMutation = useMutation<TokenForRunnerResponse, Error, TokenForRunnerParams>({
    mutationFn: async ({ expoToken, runnerId }) => {
      const response = await fetch(`${pushNotificationsServiceURL}/api/token/add-token-for-runner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoToken,
          runnerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to add token for runner");
      }

      return response.json();
    },
  });

  const deleteTokenForRunnerMutation = useMutation<TokenForRunnerResponse, Error, TokenForRunnerParams>({
    mutationFn: async ({ expoToken, runnerId }) => {
      const response = await fetch(`${pushNotificationsServiceURL}/api/token/delete-token-for-runner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoToken,
          runnerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to delete token for runner");
      }

      return response.json();
    },
  });

  return {
    addTokenForRunnerMutation,
    deleteTokenForRunnerMutation,
  };
};

export const useSettingsForToken = ({ expoToken }: GetSettingsForTokenParams) => {
  const [hasNotificationsEnabledOnDevice, setHasNotificationsEnabledOnDevice] = useState(false);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setHasNotificationsEnabledOnDevice(status === "granted");
    });
  }, []);

  return useQuery<TokenSettingsResponse, Error>({
    queryKey: ["token-settings", expoToken],
    queryFn: async () => {
      const response = await fetch(`${pushNotificationsServiceURL}/api/token/get-settings-for-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to get settings for token");
      }

      return response.json();
    },
    staleTime: Infinity,
    enabled: !!expoToken && hasNotificationsEnabledOnDevice,
  });
};
