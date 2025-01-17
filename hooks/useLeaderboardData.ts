import LeaderboardEntry, { TrophyEntry } from "@/lib/types/Leaderboard";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
  season?: string;
}

export const useLeaderboardData = ({ filter, removeDuplicates, date, season = "current" }: LeaderboardParams) => {
  if (filter >= 4) {
    return useQuery<TrophyEntry[]>({
      queryKey: ["trophy", { season }],
      queryFn: () =>
        fetch(`https://paceman.gg/api/us/trophy?season=${encodeURIComponent(season.replace("-", " "))}`).then((res) =>
          res.json()
        ),
      staleTime: Infinity,
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
    staleTime: Infinity,
  });
};
