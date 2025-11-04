import { useNotification } from "@/providers/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

const pushNotificationsServiceURL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

interface TokenForRunnerParams {
  runnerId: string;
}

interface TokenForRunnerResponse {
  message: string;
  runnerId: string;
  expoToken: string;
}

interface TokenSettingsResponse {
  "1_16_1": {
    enabled: number;
    second_structure: number;
    first_portal: number;
    enter_stronghold: number;
    enter_end: number;
    credits: number;
  };
  runners: string[];
}

export const useTokenForRunner = () => {
  const { expoPushToken } = useNotification();
  const queryClient = useQueryClient();

  const addTokenForRunnerMutation = useMutation<TokenForRunnerResponse, Error, TokenForRunnerParams>({
    mutationFn: async ({ runnerId }) => {
      if (!expoPushToken) {
        throw new Error("Expo push token not available");
      }

      const response = await fetch(`${pushNotificationsServiceURL}/api/token/add-token-for-runner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoToken: expoPushToken,
          runnerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to add token for runner");
      }

      return response.json();
    },
    onMutate: async ({ runnerId }) => {
      if (!expoPushToken) return;

      const queryKey = ["token-settings", expoPushToken];

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to add runner
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const currentRunners = old.runners || [];
        const newRunners = [...currentRunners, runnerId];
        return {
          ...old,
          runners: newRunners,
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (!expoPushToken) return;
      if (!context || typeof context !== "object" || !("previousData" in context)) return;

      const queryKey = ["token-settings", expoPushToken];
      // Rollback on error
      queryClient.setQueryData(queryKey, context.previousData);
      queryClient.invalidateQueries({ queryKey });
    },
    onSettled: () => {
      if (!expoPushToken) return;

      const queryKey = ["token-settings", expoPushToken];
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteTokenForRunnerMutation = useMutation<TokenForRunnerResponse, Error, TokenForRunnerParams>({
    mutationFn: async ({ runnerId }) => {
      if (!expoPushToken) {
        throw new Error("Expo push token not available");
      }

      const response = await fetch(`${pushNotificationsServiceURL}/api/token/delete-token-for-runner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoToken: expoPushToken,
          runnerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to delete token for runner");
      }

      return response.json();
    },
    onMutate: async ({ runnerId }) => {
      if (!expoPushToken) return;

      const queryKey = ["token-settings", expoPushToken];

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to remove runner
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const currentRunners = old.runners || [];
        const newRunners = currentRunners.filter((id: string) => id !== runnerId);
        return {
          ...old,
          runners: newRunners,
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (!expoPushToken) return;
      if (!context || typeof context !== "object" || !("previousData" in context)) return;

      const queryKey = ["token-settings", expoPushToken];
      // Rollback on error
      queryClient.setQueryData(queryKey, context.previousData);
      queryClient.invalidateQueries({ queryKey });
    },
    onSettled: () => {
      if (!expoPushToken) return;

      const queryKey = ["token-settings", expoPushToken];
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    addTokenForRunnerMutation,
    deleteTokenForRunnerMutation,
  };
};

export const useSettingsForToken = () => {
  const [hasNotificationsEnabledOnDevice, setHasNotificationsEnabledOnDevice] = useState(false);
  const { expoPushToken } = useNotification();
  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setHasNotificationsEnabledOnDevice(status === "granted");
    });
  }, []);

  return useQuery<TokenSettingsResponse, Error>({
    queryKey: ["token-settings", expoPushToken],
    queryFn: async () => {
      const response = await fetch(`${pushNotificationsServiceURL}/api/token/get-settings-for-token/${expoPushToken}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to get settings for token");
      }

      return response.json();
    },
    staleTime: Infinity,
    enabled: !!expoPushToken && hasNotificationsEnabledOnDevice,
  });
};
