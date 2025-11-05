import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-token-for-runner";
import { ReactNode } from "react";

interface PrefetcherProviderProps {
  children: ReactNode;
}

export const PrefetcherProvider = ({ children }: PrefetcherProviderProps) => {
  useAllUsersData();
  useSettingsForToken();

  return <>{children}</>;
};
