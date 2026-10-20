import { UserData } from "@/lib/types/User";
import { useQuery } from "@tanstack/react-query";
import { useIsFocused } from "expo-router";

interface UserProps {
  name: string;
}

export const useUserData = ({ name }: UserProps) => {
  const isFocusedOnPlayerPage = useIsFocused();
  return useQuery<UserData>({
    queryKey: ["user", { name }],
    queryFn: () => fetch(`https://paceman.gg/api/us/user?name=${name}&sortByTime=1`).then((res) => res.json()),
    staleTime: 60 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
    enabled: isFocusedOnPlayerPage,
  });
};
