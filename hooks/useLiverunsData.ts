import { useQuery } from "@tanstack/react-query";

export function useLiverunsData() {
  return useQuery({
    queryKey: ["liveruns"],
    queryFn: () => fetch("/api/liveruns").then((res) => res.json()),
    refetchInterval: 3000,
    staleTime: 3000,
  });
}
