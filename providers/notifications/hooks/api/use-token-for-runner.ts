import { useMutation } from "@tanstack/react-query";

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
