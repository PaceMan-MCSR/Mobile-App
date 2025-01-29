import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/lib/types/Stats";
interface StatsProps {
  days: number;
  category: string;
  type: "count" | "average" | "fastest" | "conversion";
}

export const useStatsData = ({ days, category, type }: StatsProps) => {
  return useQuery<Stats[]>({
    queryKey: ["stats", { days, category, type }],
    queryFn: () =>
      fetch(
        `https://paceman.gg/stats/api/getLeaderboard/?category=${category}&type=${type}&days=${days}&limit=25`
      ).then((res) => res.json()),
    staleTime: Infinity,
  });
};
