import { Pace, PaceSettings } from "@/lib/types/Pace";
import { apiToPace, paceSort } from "@/lib/utils/converters";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { usePathname } from "expo-router";

export const useLiverunsData = ({ gameVersion, liveOnly }: PaceSettings) => {
  const pathname = usePathname();
  const isFocusedOnHomePage = pathname === "/";
  return useQuery<Pace[]>({
    queryKey: ["liveruns", gameVersion, liveOnly],
    queryFn: async () => {
      const response = await fetch(
        `https://paceman.gg/api/ars/liveruns?gameVersion=${gameVersion}&liveOnly=${liveOnly ? "true" : "false"}`
      );
      const data = await response.json();
      const res = (await apiToPace(data)).sort(paceSort);
      return res;
    },
    staleTime: 5000,
    refetchInterval: 5000,
    enabled: isFocusedOnHomePage,
  });
};

export const useLiverunsDataSuspense = ({ gameVersion, liveOnly }: PaceSettings) => {
  return useSuspenseQuery<Pace[]>({
    queryKey: ["liveruns", gameVersion, liveOnly],
    queryFn: async () => {
      const response = await fetch(
        `https://paceman.gg/api/ars/liveruns?gameVersion=${gameVersion}&liveOnly=${liveOnly ? "true" : "false"}`
      );
      const data = await response.json();
      const res = (await apiToPace(data)).sort(paceSort);
      return res;
    },
    staleTime: 10000,
    refetchInterval: 10000,
  });
};
