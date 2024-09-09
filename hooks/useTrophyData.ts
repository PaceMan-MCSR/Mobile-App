import { useQuery } from "@tanstack/react-query";

interface TrophyParams {
  season?: string;
}

export const useTrophyData = ({ season }: TrophyParams) => {
  return useQuery({
    queryKey: ["trophy", { season }],
    queryFn: () => fetch(`https://paceman.gg/api/us/trophy?season=${season ?? "current"}`).then((res) => res.json()),
  });
};
