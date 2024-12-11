import { useQuery } from "@tanstack/react-query";

export const useEventListData = () => {
  return useQuery({
    queryKey: ["eventlist"],
    queryFn: () => fetch("https://paceman.gg/api/get-events").then((res) => res.json()),
  });
};
