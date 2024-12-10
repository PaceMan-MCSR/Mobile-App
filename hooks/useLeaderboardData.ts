import { useQuery } from "@tanstack/react-query";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
  season?: string;
}

export const useLeaderboardData = ({ filter, removeDuplicates, date, season }: LeaderboardParams) => {
  return useQuery({
    queryKey: ["leaderboard", { filter, removeDuplicates, date, season }],
    queryFn: () =>
      filter === 4
        ? fetch(`/api/trophy?season=${encodeURIComponent((season ?? "current").replace("-", " "))}`).then((res) =>
            res.json()
          )
        : fetch(`/api/leaderboard?filter=${filter}&removeDuplicates=${removeDuplicates ? 1 : 0}&date=${date}`).then(
            (res) => res.json()
          ),
    staleTime: Infinity,
  });
};
