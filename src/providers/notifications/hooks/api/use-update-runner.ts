import { useNotification } from "@/providers/notifications";
import { getIntegrityHeaders } from "@/providers/notifications/helpers/get-integrity-headers";
import { handleIntegrityError } from "@/providers/notifications/helpers/handle-integrity-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import type { RunnerSettings, UpdateRunnerSettingsParams, UpdateRunnerSettingsResponse } from "./types";

const PUSH_NOTIFICATIONS_SERVICE_URL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

export const useUpdateRunner = () => {
  const { expoToken, deviceToken } = useNotification();
  const queryClient = useQueryClient();

  const updateRunnerSettingsMutation = useMutation<UpdateRunnerSettingsResponse, Error, UpdateRunnerSettingsParams>({
    retry: 2,
    mutationFn: async ({ runnerId, ...settings }) => {
      if (!expoToken || !deviceToken) {
        throw new Error("Push token not available.");
      }
      // Get current settings from query cache
      const currentSettings = queryClient.getQueryData<any>(["token-settings", expoToken]);

      // Find the current runner settings
      const currentRunners = currentSettings?.runners || [];
      const currentRunner = currentRunners.find((r: RunnerSettings) => r.id === runnerId);
      const currentV1_16_1 = currentRunner?.v1_16_1 || {};

      // Start with current values, then override with any provided updates
      const allFields = {
        v1_16_1_enabled: settings.v1_16_1_enabled ?? currentV1_16_1.enabled ?? null,
        v1_16_1_second_structure: settings.v1_16_1_second_structure ?? currentV1_16_1.second_structure ?? null,
        v1_16_1_first_portal: settings.v1_16_1_first_portal ?? currentV1_16_1.first_portal ?? null,
        v1_16_1_enter_stronghold: settings.v1_16_1_enter_stronghold ?? currentV1_16_1.enter_stronghold ?? null,
        v1_16_1_enter_end: settings.v1_16_1_enter_end ?? currentV1_16_1.enter_end ?? null,
        v1_16_1_credits: settings.v1_16_1_credits ?? currentV1_16_1.credits ?? null,
      };

      const integrityHeaders = await getIntegrityHeaders(expoToken, deviceToken);

      const response = await fetch(`${PUSH_NOTIFICATIONS_SERVICE_URL}/api/pns/token/update-token-settings-for-runner`, {
        method: "POST",
        headers: {
          ...integrityHeaders,
        },
        body: JSON.stringify({
          expoToken,
          runnerId,
          ...allFields,
        }),
      });

      if (!response.ok) {
        const { tokenNotFound } = await handleIntegrityError(response);
        const error = await response.json().catch(() => ({ error: "Unknown error" }));

        if (tokenNotFound) {
          const tokenNotFoundError = new Error("TOKEN_NOT_FOUND") as Error & { tokenNotFound: boolean };
          tokenNotFoundError.tokenNotFound = true;
          throw tokenNotFoundError;
        }

        throw new Error(error.error || "Failed to update runner settings");
      }

      return response.json();
    },
    onMutate: async (variables) => {
      if (!expoToken) return;

      const queryKey = ["token-settings", expoToken];

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update runner settings
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const currentRunners = old.runners || [];
        const runnerIndex = currentRunners.findIndex((r: RunnerSettings) => r.id === variables.runnerId);

        if (runnerIndex === -1) return old;

        const updatedRunners = [...currentRunners];
        const runner = { ...updatedRunners[runnerIndex] };
        const v1_16_1 = { ...runner.v1_16_1 };

        // Handle enabled toggle
        if (variables.v1_16_1_enabled !== undefined) {
          v1_16_1.enabled = variables.v1_16_1_enabled;
        }

        // Handle other settings
        if (variables.v1_16_1_second_structure !== undefined) {
          v1_16_1.second_structure = variables.v1_16_1_second_structure;
        }
        if (variables.v1_16_1_first_portal !== undefined) {
          v1_16_1.first_portal = variables.v1_16_1_first_portal;
        }
        if (variables.v1_16_1_enter_stronghold !== undefined) {
          v1_16_1.enter_stronghold = variables.v1_16_1_enter_stronghold;
        }
        if (variables.v1_16_1_enter_end !== undefined) {
          v1_16_1.enter_end = variables.v1_16_1_enter_end;
        }
        if (variables.v1_16_1_credits !== undefined) {
          v1_16_1.credits = variables.v1_16_1_credits;
        }

        runner.v1_16_1 = v1_16_1;
        updatedRunners[runnerIndex] = runner;

        return {
          ...old,
          runners: updatedRunners,
        };
      });

      return { previousData };
    },
    onError: (error, _variables, context) => {
      Alert.alert("Error", error.message || "Failed to update runner settings");
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
    updateRunnerSettingsMutation,
  };
};
