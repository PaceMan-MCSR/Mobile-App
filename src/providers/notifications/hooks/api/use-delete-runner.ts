import { useNotification } from "@/providers/notifications";
import { getIntegrityHeaders } from "@/providers/notifications/helpers/get-integrity-headers";
import { handleIntegrityError } from "@/providers/notifications/helpers/handle-integrity-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Platform } from "react-native";
import type { RunnerSettings, TokenForRunnerParams, TokenForRunnerResponse } from "./types";

const PUSH_NOTIFICATIONS_SERVICE_URL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

export const useDeleteRunner = () => {
  const { expoToken, deviceToken } = useNotification();
  const queryClient = useQueryClient();

  const deleteTokenForRunnerMutation = useMutation<TokenForRunnerResponse, Error, TokenForRunnerParams>({
    retry: 2,
    mutationFn: async ({ runnerId }) => {
      if (!expoToken || !deviceToken) {
        throw new Error("Push token not available.");
      }

      const url = `${PUSH_NOTIFICATIONS_SERVICE_URL}/api/pns/token/delete-token-for-runner`;
      const body = JSON.stringify({
        expoToken: expoToken,
        runnerId,
      });

      const integrityHeaders = await getIntegrityHeaders(expoToken, deviceToken);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "x-platform": Platform.OS,
          ...integrityHeaders,
        },
        body,
      });

      if (!response.ok) {
        const { tokenNotFound } = await handleIntegrityError(response);
        const error = await response.json().catch(() => ({ error: "Unknown error" }));

        if (tokenNotFound) {
          const tokenNotFoundError = new Error("TOKEN_NOT_FOUND") as Error & { tokenNotFound: boolean };
          tokenNotFoundError.tokenNotFound = true;
          throw tokenNotFoundError;
        }

        throw new Error(error.error || "Failed to delete token for runner");
      }

      return response.json();
    },
    onMutate: async ({ runnerId }) => {
      if (!expoToken) return;

      const queryKey = ["token-settings", expoToken];

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to remove runner
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const currentRunners = old.runners || [];
        const newRunners = currentRunners.filter((r: RunnerSettings) => r.id !== runnerId);
        return {
          ...old,
          runners: newRunners,
        };
      });

      return { previousData };
    },
    onError: (error, _variables, context) => {
      Alert.alert("Error", error.message || "Failed to delete token for runner");
      if (!expoToken) return;
      if (!context || typeof context !== "object" || !("previousData" in context)) return;

      const queryKey = ["token-settings", expoToken];
      // Rollback on error
      queryClient.setQueryData(queryKey, context.previousData);
      queryClient.fetchQuery({ queryKey });
    },
    onSettled: () => {
      if (!expoToken) return;

      const queryKey = ["token-settings", expoToken];
      // Refetch to ensure consistency
      queryClient.fetchQuery({ queryKey });
    },
  });

  return {
    deleteTokenForRunnerMutation,
  };
};
