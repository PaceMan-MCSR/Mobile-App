import { UserData } from "@/lib/types/User";
import { useQuery } from "@tanstack/react-query";

interface UserProps {
  name: string;
}

export const useUserData = ({ name }: UserProps) => {
  return useQuery<UserData>({
    queryKey: ["user", { name }],
    queryFn: () => fetch(`https://paceman.gg/api/us/user?name=${name}&sortByTime=1`).then((res) => res.json()),
    staleTime: Infinity,
  });
};
