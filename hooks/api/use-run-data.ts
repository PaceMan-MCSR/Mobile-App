import { useLiverunsData } from "@/hooks/api/use-liveruns-data";
import { useWorldData } from "@/hooks/api/use-world-data";
import { Pace } from "@/lib/types/Pace";
import { useEffect, useRef, useState } from "react";

export const useRunData = ({ worldId }: { worldId: string }) => {
  const {
    data: liverunsData,
    isLoading: isLiverunsLoading,
    isError: isLiverunsError,
  } = useLiverunsData({ gameVersion: "1.16.1", liveOnly: false });
  const { data: worldData, isLoading: isWorldLoading, isError: isWorldError } = useWorldData({ worldId });

  const [runData, setRunData] = useState<Pace | null>(null);
  const [isRefetchingWorld, setIsRefetchingWorld] = useState(false);
  const hasInitialized = useRef<boolean>(false);
  const isListeningToLiveruns = useRef<boolean>(false);
  const hasEverListenedToLiveruns = useRef<boolean>(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    if (isLiverunsLoading) return;

    const liverunsPace = liverunsData?.find((p) => p.worldId === worldId);

    if (liverunsPace) {
      setRunData(liverunsPace);
      isListeningToLiveruns.current = true;
      hasEverListenedToLiveruns.current = true;
      hasInitialized.current = true;
    } else {
      if (isWorldLoading) return;

      if (worldData) {
        setRunData(worldData);
      }
      isListeningToLiveruns.current = false;
      hasInitialized.current = true;
    }
  }, [worldId, liverunsData, worldData, isLiverunsLoading, isWorldLoading]);

  useEffect(() => {
    hasInitialized.current = false;
    setRunData(null);
    isListeningToLiveruns.current = false;
    hasEverListenedToLiveruns.current = false;
    setIsRefetchingWorld(false);
  }, [worldId]);

  useEffect(() => {
    if (!isListeningToLiveruns.current) return;
    if (isLiverunsLoading) return;

    const liverunsPace = liverunsData?.find((p) => p.worldId === worldId);

    if (liverunsPace) {
      // Check if the final event is "Finish"
      const finalEvent = liverunsPace.eventList[liverunsPace.eventList.length - 1];
      const isFinished = finalEvent?.name === "Finish";

      if (isFinished) {
        // First, update state with the latest liverunsPace data (which includes the finish event)
        setRunData({
          ...liverunsPace,
          isLive: false,
        });

        // Then stop listening
        isListeningToLiveruns.current = false;
      } else {
        setRunData(liverunsPace);
      }
    } else {
      isListeningToLiveruns.current = false;

      // Update the current runData to set isLive=false, preserving all other data
      setRunData((prevData) => {
        if (prevData) {
          return {
            ...prevData,
            isLive: false,
          };
        }
        return prevData;
      });
    }
  }, [liverunsData, worldId, isLiverunsLoading]);

  useEffect(() => {
    if (isListeningToLiveruns.current) return;
    if (hasEverListenedToLiveruns.current) return; // Don't update from worldData if we ever listened to liveruns
    if (isWorldLoading || isRefetchingWorld) return;

    if (worldData) {
      setRunData(worldData);
    }
  }, [worldData, isWorldLoading, isRefetchingWorld, worldId]);

  const isLoading = (!hasInitialized.current && (isLiverunsLoading || isWorldLoading)) || isRefetchingWorld;

  const isError = isLiverunsError || isWorldError;

  return {
    data: runData,
    isLoading,
    isError,
  };
};
