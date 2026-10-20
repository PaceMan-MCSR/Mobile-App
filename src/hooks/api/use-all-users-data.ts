import { User } from "@/lib/types/User";
import { useQuery } from "@tanstack/react-query";

export const useAllUsersData = () => {
  return useQuery<User[]>({
    queryKey: ["runners"],
    queryFn: () => fetch(`https://paceman.gg/stats/api/getAllUsers/`).then((res) => res.json()),
    staleTime: Infinity,
  });
};
