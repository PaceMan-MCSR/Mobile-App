import { getIntegrityHeaders } from "@/providers/notifications/helpers/get-integrity-headers";
import { handleIntegrityError } from "@/providers/notifications/helpers/handle-integrity-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import { useNotification } from "../..";

const PUSH_NOTIFICATIONS_SERVICE_URL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

interface UpdateTokenParams {
  v1_16_1_enabled?: number;
  v1_16_1_second_structure?: number;
  v1_16_1_first_portal?: number;
  v1_16_1_enter_stronghold?: number;
  v1_16_1_enter_end?: number;
  v1_16_1_credits?: number;
}

interface UpdateTokenResponse {
  message: string;
  expoToken: string;
}

const KEY_TO_PROPERTY_MAP: Record<
  | "v1_16_1_second_structure"
  | "v1_16_1_first_portal"
  | "v1_16_1_enter_stronghold"
  | "v1_16_1_enter_end"
  | "v1_16_1_credits",
  "second_structure" | "first_portal" | "enter_stronghold" | "enter_end" | "credits"
> = {
  v1_16_1_second_structure: "second_structure",
  v1_16_1_first_portal: "first_portal",
  v1_16_1_enter_stronghold: "enter_stronghold",
  v1_16_1_enter_end: "enter_end",
  v1_16_1_credits: "credits",
};

export const useUpdateToken = () => {
  const { expoToken, deviceToken } = useNotification();
  const queryClient = useQueryClient();

  const updateTokenMutation = useMutation<UpdateTokenResponse, Error, UpdateTokenParams>({
    retry: 2,
    mutationFn: async (params) => {
      if (!expoToken || !deviceToken) {
        throw new Error("Push token not available.");
      }

      // Get current settings from query cache
      const queryKey = ["token-settings", expoToken];
      const currentSettings = queryClient.getQueryData<any>(queryKey);

      // Start with current values, then override with any provided updates
      const currentV1_16_1 = currentSettings?.v1_16_1 || {};
      const allFields = {
        v1_16_1_enabled: params.v1_16_1_enabled ?? currentV1_16_1.enabled ?? null,
        v1_16_1_second_structure: params.v1_16_1_second_structure ?? currentV1_16_1.second_structure ?? null,
        v1_16_1_first_portal: params.v1_16_1_first_portal ?? currentV1_16_1.first_portal ?? null,
        v1_16_1_enter_stronghold: params.v1_16_1_enter_stronghold ?? currentV1_16_1.enter_stronghold ?? null,
        v1_16_1_enter_end: params.v1_16_1_enter_end ?? currentV1_16_1.enter_end ?? null,
        v1_16_1_credits: params.v1_16_1_credits ?? currentV1_16_1.credits ?? null,
      };

      const url = `${PUSH_NOTIFICATIONS_SERVICE_URL}/api/pns/token/update-token`;
      const body = JSON.stringify({
        expoToken: expoToken,
        ...allFields,
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
          // Throw special error that can trigger re-registration
          const tokenNotFoundError = new Error("TOKEN_NOT_FOUND") as Error & { tokenNotFound: boolean };
          tokenNotFoundError.tokenNotFound = true;
          throw tokenNotFoundError;
        }

        throw new Error(error.error || "Failed to update token");
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

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const updates: any = { ...old["v1_16_1"] };

        // Handle enabled toggle
        if (variables["v1_16_1_enabled"] !== undefined) {
          updates.enabled = variables["v1_16_1_enabled"];
        }

        // Handle dropdown changes
        Object.keys(KEY_TO_PROPERTY_MAP).forEach((key) => {
          if (variables[key as keyof UpdateTokenParams] !== undefined) {
            const propertyName = KEY_TO_PROPERTY_MAP[key as keyof typeof KEY_TO_PROPERTY_MAP];
            updates[propertyName] = variables[key as keyof UpdateTokenParams];
          }
        });

        return {
          ...old,
          v1_16_1: updates,
        };
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      // Silent error handling - no user alerts, error is handled by rollback below
      // Optimistic update is rolled back on error to maintain UI consistency
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
    updateTokenMutation,
  };
};
