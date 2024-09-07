import { useQuery } from "@tanstack/react-query";

export const useEventListData = () => {
  return useQuery({
    queryKey: ["eventlist"],
    queryFn: () =>
      fetch("/api/eventlist")
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched data:", data);
          return data;
        }),
  });
};
