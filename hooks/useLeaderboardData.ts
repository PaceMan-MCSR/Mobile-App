import { useQuery } from "@tanstack/react-query";

interface LeaderboardParams {
  filter: number;
  removeDuplicates: boolean;
  date: number;
}

export const useLeaderboardData = ({ filter, removeDuplicates, date }: LeaderboardParams) => {
  return useQuery({
    queryKey: ["leaderboard", { filter, removeDuplicates, date }],
    queryFn: () =>
      fetch(`/api/leaderboard?filter=${filter}&removeDuplicates=${removeDuplicates ? 1 : 0}&date=${date}`).then((res) =>
        res.json()
      ),
  });
};
