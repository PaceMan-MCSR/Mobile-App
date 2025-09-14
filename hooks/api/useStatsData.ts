import { Stats } from "@/lib/types/Stats";
import { useQuery } from "@tanstack/react-query";
import { useSegments } from "expo-router";
interface StatsProps {
  days: number;
  category: string;
  type: "count" | "average" | "fastest" | "conversion";
}

export const useStatsData = ({ days, category, type }: StatsProps) => {
  const [, page] = useSegments();
  const isFocusedOnStatsPage = page === "stats";
  return useQuery<Stats[]>({
    queryKey: ["stats", { days, category, type }],
    queryFn: () =>
      fetch(
        `https://paceman.gg/stats/api/getLeaderboard/?category=${category}&type=${type}&days=${days}&limit=25`
      ).then((res) => res.json()),
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: 24 * 60 * 60 * 1000,
    enabled: isFocusedOnStatsPage,
  });
};
