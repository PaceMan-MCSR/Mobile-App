import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

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
  "1_16_1_enabled"?: number;
  "1_16_1_second_structure"?: number;
  "1_16_1_first_portal"?: number;
  "1_16_1_enter_stronghold"?: number;
  "1_16_1_enter_end"?: number;
  "1_16_1_credits"?: number;
}

interface UpdateTokenResponse {
  message: string;
  expoToken: string;
}

// Map API key to backend response property name
const KEY_TO_PROPERTY_MAP: Record<
  "1_16_1_second_structure" | "1_16_1_first_portal" | "1_16_1_enter_stronghold" | "1_16_1_enter_end" | "1_16_1_credits",
  "second_structure" | "first_portal" | "enter_stronghold" | "enter_end" | "credits"
> = {
  "1_16_1_second_structure": "second_structure",
  "1_16_1_first_portal": "first_portal",
  "1_16_1_enter_stronghold": "enter_stronghold",
  "1_16_1_enter_end": "enter_end",
  "1_16_1_credits": "credits",
};

// Hook for registering tokens (doesn't need expoPushToken from context)
export const useRegisterToken = () => {
  const registerTokenMutation = useMutation<RegisterTokenResponse, Error, RegisterTokenParams>({
    mutationFn: registerToken,
  });

  return {
    registerTokenMutation,
  };
};

// Hook for updating tokens (needs expoPushToken from context)
export const useUpdateToken = (expoPushToken: string | null) => {
  const queryClient = useQueryClient();
  const debounceTimeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  const updateTokenMutation = useMutation<UpdateTokenResponse, Error, UpdateTokenParams>({
    mutationFn: async ({
      "1_16_1_enabled": enabled1_16_1,
      "1_16_1_second_structure": secondStructure1_16_1,
      "1_16_1_first_portal": firstPortal1_16_1,
      "1_16_1_enter_stronghold": enterStronghold1_16_1,
      "1_16_1_enter_end": enterEnd1_16_1,
      "1_16_1_credits": credits1_16_1,
    }) => {
      if (!expoPushToken) {
        throw new Error("Expo push token not available");
      }

      const response = await fetch(`${pushNotificationsServiceURL}/api/token/update-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoToken: expoPushToken,
          ...(enabled1_16_1 !== undefined && { "1_16_1_enabled": enabled1_16_1 }),
          ...(secondStructure1_16_1 !== undefined && { "1_16_1_second_structure": secondStructure1_16_1 }),
          ...(firstPortal1_16_1 !== undefined && { "1_16_1_first_portal": firstPortal1_16_1 }),
          ...(enterStronghold1_16_1 !== undefined && { "1_16_1_enter_stronghold": enterStronghold1_16_1 }),
          ...(enterEnd1_16_1 !== undefined && { "1_16_1_enter_end": enterEnd1_16_1 }),
          ...(credits1_16_1 !== undefined && { "1_16_1_credits": credits1_16_1 }),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || "Failed to update token");
      }

      return response.json();
    },
    onMutate: async (variables) => {
      if (!expoPushToken) return;

      const queryKey = ["token-settings", expoPushToken];

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const updates: any = { ...old["1_16_1"] };

        // Handle enabled toggle
        if (variables["1_16_1_enabled"] !== undefined) {
          updates.enabled = variables["1_16_1_enabled"];
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
          "1_16_1": updates,
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

  // Debounced update function for dropdown changes
  const debouncedUpdateTokenMutation = useCallback(
    (params: UpdateTokenParams, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      if (!expoPushToken) {
        console.log("[DebouncedUpdate] No expo push token available");
        return;
      }

      // Create a unique key for this debounce based on the params
      const debounceKey = Object.keys(params).sort().join("_");

      // Clear existing timeout for this key
      if (debounceTimeoutRefs.current[debounceKey]) {
        clearTimeout(debounceTimeoutRefs.current[debounceKey]!);
      }

      // Optimistically update immediately
      const queryKey = ["token-settings", expoPushToken];
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        const updates: any = { ...old["1_16_1"] };

        // Handle dropdown changes
        Object.keys(KEY_TO_PROPERTY_MAP).forEach((key) => {
          if (params[key as keyof UpdateTokenParams] !== undefined) {
            const propertyName = KEY_TO_PROPERTY_MAP[key as keyof typeof KEY_TO_PROPERTY_MAP];
            updates[propertyName] = params[key as keyof UpdateTokenParams];
          }
        });

        return {
          ...old,
          "1_16_1": updates,
        };
      });

      // Set new timeout for API call
      debounceTimeoutRefs.current[debounceKey] = setTimeout(() => {
        updateTokenMutation.mutate(params, {
          onSuccess: () => {
            options?.onSuccess?.();
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        });
        debounceTimeoutRefs.current[debounceKey] = null;
      }, 1000);
    },
    [expoPushToken, queryClient, updateTokenMutation]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimeoutRefs.current).forEach((timeout) => {
        if (timeout) {
          clearTimeout(timeout);
        }
      });
    };
  }, []);

  return {
    updateTokenMutation,
    debouncedUpdateTokenMutation,
  };
};
