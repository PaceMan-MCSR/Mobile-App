import { handleIntegrityError } from "@/providers/notifications/helpers/handle-integrity-error";
import { postTokenToBackend } from "@/providers/notifications/helpers/post-token-to-backend";
import { useMutation } from "@tanstack/react-query";
import { setItemAsync } from "expo-secure-store";

export interface RegisterTokenParams {
  expoToken: string;
  deviceToken: string;
  deviceType?: "ios" | "android";
  cachedExpoToken?: string | null;
  cachedDeviceToken?: string | null;
}

export interface RegisterTokenResponse {
  message: string;
  id: number;
  expoToken?: string; // Add this optional field
}

export const useRegisterToken = () => {
  const registerTokenMutation = useMutation<RegisterTokenResponse, Error, RegisterTokenParams>({
    mutationFn: async (params: RegisterTokenParams): Promise<RegisterTokenResponse> => {
      const response = await postTokenToBackend(params);
      if (!response.ok) {
        const { tokenNotFound } = await handleIntegrityError(response);
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        if (tokenNotFound) {
          const tokenNotFoundError = new Error("TOKEN_NOT_FOUND") as Error & { tokenNotFound: boolean };
          tokenNotFoundError.tokenNotFound = true;
          throw tokenNotFoundError;
        }
        throw new Error(error.error || "Failed to register token");
      }
      return response.json();
    },

    retry: 2,

    onSuccess: async (_, variables) => {
      const { expoToken, deviceToken } = variables;
      await Promise.all([
        setItemAsync("cached-expo-token", expoToken),
        setItemAsync("cached-device-token", deviceToken),
      ]);
    },
  });

  return {
    registerTokenMutation,
  };
};
