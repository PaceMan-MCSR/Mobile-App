import { useQuery } from "@tanstack/react-query";
import { apiToPace, paceSort } from "@/lib/utils/converters";

interface LiverunsDataParams {
  gameVersion?: string;
  liveOnly?: boolean;
}

export function useLiverunsData({ gameVersion, liveOnly }: LiverunsDataParams) {
  return useQuery({
    queryKey: ["liveruns"],
    queryFn: async () => {
      const response = await fetch(
        `https://paceman.gg/api/ars/liveruns?gameVersion=${gameVersion}&liveOnly=${liveOnly}`
      );
      const data = await response.json();
      const res = (await apiToPace(data)).sort(paceSort);
      return res;
    },
    refetchInterval: 5000,
    staleTime: 5000,
  });
}
