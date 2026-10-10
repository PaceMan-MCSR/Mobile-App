import { Pace } from "@/lib/types/Pace";
import { worldToPace } from "@/lib/utils/converters";
import { useQuery } from "@tanstack/react-query";

export const useWorldData = ({ worldId }: { worldId: string }) => {
  return useQuery<Pace | null>({
    queryKey: ["world", worldId],
    queryFn: () =>
      fetch(`https://paceman.gg/stats/api/getWorld/?worldId=${worldId}`)
        .then((res) => (!res.ok ? null : res.json()))
        .then((data) => (data ? (worldToPace(data) as Pace) : null)),
    staleTime: Infinity,
    refetchInterval: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
