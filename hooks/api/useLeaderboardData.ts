import { LeaderboardEntry, TrophyEntry } from "@/lib/types/Leaderboard";
import { useQuery } from "@tanstack/react-query";
import { useSegments } from "expo-router";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
  season?: string;
}

export const useLeaderboardData = ({ filter, removeDuplicates, date, season = "current" }: LeaderboardParams) => {
  const [, page] = useSegments();
  const isFocusedOnLBPage = page === "lb";

  if (filter >= 4) {
    return useQuery<TrophyEntry[]>({
      queryKey: ["trophy", { season }],
      queryFn: () =>
        fetch(`https://paceman.gg/api/us/trophy?season=${encodeURIComponent(season.replace("-", " "))}`).then((res) =>
          res.json()
        ),
      staleTime: 24 * 60 * 60 * 1000,
      refetchInterval: 24 * 60 * 60 * 1000,
      enabled: isFocusedOnLBPage,
    });
  }

  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", { filter, removeDuplicates, date }],
    queryFn: () =>
      fetch(
        `https://paceman.gg/api/cs/leaderboard?filter=${filter}&removeDuplicates=${
          removeDuplicates ? 1 : 0
        }&date=${date}`
      ).then((res) => res.json()),
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: 24 * 60 * 60 * 1000,
    enabled: isFocusedOnLBPage,
  });
};
