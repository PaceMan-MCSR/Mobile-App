import { useNotification } from "@/providers/notifications";
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { Platform } from "react-native";
import { handleIntegrityError } from "../../helpers/handle-integrity-error";
import type { TokenSettingsResponse } from "./types";

const PUSH_NOTIFICATIONS_SERVICE_URL = process.env.EXPO_PUBLIC_PUSH_NOTIFICATIONS_SERVICE_URL!;

export const getSettingsForToken = async ({
  queryKey,
}: QueryFunctionContext<readonly unknown[]>): Promise<TokenSettingsResponse> => {
  const expoToken = queryKey[1] as string;
  if (!expoToken) {
    throw new Error("Expo token is required");
  }
  console.log(`Refetch hit.`);

  const response = await fetch(`${PUSH_NOTIFICATIONS_SERVICE_URL}/api/pns/token/get-settings-for-token/${expoToken}`, {
    headers: {
      "x-platform": Platform.OS,
    },
  });

  if (!response.ok) {
    const { tokenNotFound } = await handleIntegrityError(response);
    const error = await response.json().catch(() => ({ error: "Unknown error" }));

    if (tokenNotFound) {
      const tokenNotFoundError = new Error("TOKEN_NOT_FOUND") as Error & { tokenNotFound: boolean };
      tokenNotFoundError.tokenNotFound = true;
      throw tokenNotFoundError;
    }

    throw new Error(error.error || "Failed to get settings for token");
  }

  return response.json();
};

export const useSettingsForToken = () => {
  const { expoToken, permission } = useNotification();

  const query = useQuery<TokenSettingsResponse, Error>({
    queryKey: ["token-settings", expoToken],
    queryFn: getSettingsForToken,
    staleTime: Infinity,
    enabled: !!expoToken && permission === "granted",
    retry: 2,
  });

  return query;
};
