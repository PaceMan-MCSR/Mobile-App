import { UserData } from "@/lib/types/User";
import { useQuery } from "@tanstack/react-query";
import { useSegments } from "expo-router";

interface UserProps {
  name: string;
}

export const useUserData = ({ name }: UserProps) => {
  const [, page] = useSegments();
  const isFocusedOnPlayerPage = page === "player";
  return useQuery<UserData>({
    queryKey: ["user", { name }],
    queryFn: () => fetch(`https://paceman.gg/api/us/user?name=${name}&sortByTime=1`).then((res) => res.json()),
    staleTime: 24 * 60 * 60 * 1000,
    refetchInterval: 24 * 60 * 60 * 1000,
    enabled: isFocusedOnPlayerPage,
  });
};
