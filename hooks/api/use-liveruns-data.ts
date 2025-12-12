import { Pace, PaceSettings } from "@/lib/types/Pace";
import { liverunsToPace, paceSort } from "@/lib/utils/converters";
import { useQuery } from "@tanstack/react-query";
import { useSegments } from "expo-router";

export const useLiverunsData = ({ gameVersion, liveOnly }: PaceSettings) => {
  const [, page] = useSegments();
  const shouldRefetchLiveruns = page === "(home)" || page === "run";
  return useQuery<Pace[]>({
    queryKey: ["liveruns", gameVersion, liveOnly],
    queryFn: () =>
      fetch(`https://paceman.gg/api/ars/liveruns?gameVersion=${gameVersion}&liveOnly=${liveOnly ? "true" : "false"}`)
        .then((res) => res.json())
        .then((data) => liverunsToPace(data).sort(paceSort)),
    staleTime: 5000,
    refetchInterval: 5000,
    enabled: shouldRefetchLiveruns,
  });
};
