import { useNotification } from "@/providers/notifications";
import { getIntegrityHeaders } from "@/providers/notifications/helpers/get-integrity-headers";
import { handleIntegrityError } from "@/providers/notifications/helpers/handle-integrity-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import type { RunnerSettings, TokenForRunnerParams, TokenForRunnerResponse } from "./types";

const PUSH_NOTIFICATIONS_SERVICE_URL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

export const useAddRunner = () => {
  const { expoToken, deviceToken } = useNotification();
  const queryClient = useQueryClient();

  const addTokenForRunnerMutation = useMutation<TokenForRunnerResponse, Error, TokenForRunnerParams>({
    retry: 2,
    mutationFn: async ({ runnerId }) => {
      if (!expoToken || !deviceToken) {
        throw new Error("Push token not available.");
      }

      const body = JSON.stringify({
        expoToken: expoToken,
        runnerId,
      });

      const headers = await getIntegrityHeaders(expoToken, deviceToken);

      const response = await fetch(`${PUSH_NOTIFICATIONS_SERVICE_URL}/api/pns/token/add-token-for-runner`, {
        method: "POST",
        headers,
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

        throw new Error(error.error || "Failed to add token for runner");
      }

      return response.json();
    },
    onMutate: async ({ runnerId }) => {
      if (!expoToken) return;
      const queryKey = ["token-settings", expoToken];
      await queryClient.cancelQueries({ queryKey: ["token-settings", expoToken] });
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to add runner
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const currentRunners = old.runners || [];
        // Check if runner already exists
        const runnerExists = currentRunners.some((r: RunnerSettings) => r.id === runnerId);
        if (runnerExists) return old;
        const newRunner: RunnerSettings = {
          id: runnerId,
          v1_16_1: {
            enabled: old.v1_16_1?.enabled ?? 1,
            second_structure: old.v1_16_1?.second_structure ?? 300000,
            first_portal: old.v1_16_1?.first_portal ?? 390000,
            enter_stronghold: old.v1_16_1?.enter_stronghold ?? 480000,
            enter_end: old.v1_16_1?.enter_end ?? 540000,
            credits: old.v1_16_1?.credits ?? 600000,
          },
        };
        const newRunners = [...currentRunners, newRunner];
        return {
          ...old,
          runners: newRunners,
        };
      });
      return { previousData };
    },
    onError: (error, _variables, context) => {
      Alert.alert("Error", error.message || "Failed to add token for runner");
      if (!expoToken) return;
      if (!context || typeof context !== "object" || !("previousData" in context)) return;
      const queryKey = ["token-settings", expoToken];
      queryClient.setQueryData(queryKey, context.previousData);
      queryClient.fetchQuery({ queryKey });
    },
    onSettled: () => {
      const queryKey = ["token-settings", expoToken];
      queryClient.fetchQuery({ queryKey });
    },
  });

  return {
    addTokenForRunnerMutation,
  };
};
