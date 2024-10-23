import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

export function useLiverunsData(): UseQueryResult<any> {
  const isFocusedRef = useRef(true);
  const isFirstMountRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;

      return () => {
        isFocusedRef.current = false;
      };
    }, [])
  );

  const { data, refetch, ...rest } = useQuery({
    queryKey: ["liveruns"],
    queryFn: () => fetch("/api/liveruns").then((res) => res.json()),
    enabled: isFocusedRef.current,
    refetchInterval: isFocusedRef.current ? 10000 : false,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    staleTime: 10000,
  });

  useFocusEffect(
    useCallback(() => {
      if (isFirstMountRef.current) {
        isFirstMountRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );

  return { data, refetch, ...rest };
}
