import { useQuery } from "@tanstack/react-query";

export function useLiverunsData() {
  return useQuery({
    queryKey: ["liveruns"],
    queryFn: () => fetch("/api/liveruns").then((res) => res.json()),
    refetchInterval: 10000,
    staleTime: 10000,
  });
}
