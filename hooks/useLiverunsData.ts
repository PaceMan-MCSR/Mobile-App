import { Pace, PaceSettings } from "@/lib/types/Pace";
import { apiToPace, paceSort } from "@/lib/utils/converters";
import { useQuery } from "@tanstack/react-query";

export const useLiverunsData = ({ gameVersion, liveOnly }: PaceSettings) => {
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
    staleTime: 10000,
    refetchInterval: 10000,
  });
};
