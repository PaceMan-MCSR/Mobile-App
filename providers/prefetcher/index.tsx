import { useAllUsersData } from "@/hooks/api/use-all-users-data";
import { useNotification } from "@/providers/notifications";
import { useSettingsForToken } from "@/providers/notifications/hooks/api/use-settings-for-token";
import { createContext, ReactNode, useContext, useEffect } from "react";
interface PrefetcherContextType {
  integrityTokenProviderPrepared: boolean;
}

const PrefetcherContext = createContext<PrefetcherContextType | undefined>(undefined);

export const usePrefetcher = () => {
  const context = useContext(PrefetcherContext);
  if (context === undefined) {
    throw new Error("usePrefetcher must be used within a PrefetcherProvider");
  }
  return context;
};

interface PrefetcherProviderProps {
  children: ReactNode;
}

export const PrefetcherProvider = ({ children }: PrefetcherProviderProps) => {
  const { refetch } = useSettingsForToken();
  const { expoToken } = useNotification();

  useAllUsersData();
  useEffect(() => {
    if (expoToken) {
      console.log("Refetched from prefetcher.");
      refetch();
    }
  }, [expoToken]);

  return (
    <PrefetcherContext.Provider value={{ integrityTokenProviderPrepared: false }}>
      {children}
    </PrefetcherContext.Provider>
  );
};
