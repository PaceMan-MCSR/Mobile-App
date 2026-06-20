import TwitchButton from "@/components/twitch-button";
import { Pace } from "@/lib/types/Pace";
import { getSortedEventsWithTimes, msToTime } from "@/lib/utils/frontend-converters";
import { BottomSheet, Column, RNHostView, Row, Spacer, Text } from "@expo/ui";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

interface PaceBottomSheetProps {
  liveruns: Pace[] | undefined;
  selectedWorldId: string | null;
  isPresented: boolean;
  onDismiss: () => void;
}

const PaceBottomSheet = ({ liveruns, selectedWorldId, isPresented, onDismiss }: PaceBottomSheetProps) => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const incompleteColor = isDark ? "#6B7280" : "#A0A0A0";

  // Live data for the selected run — updates as react-query refetches.
  const livePace = useMemo(() => liveruns?.find((run) => run.worldId === selectedWorldId), [liveruns, selectedWorldId]);

  // The sheet's OWN copy of the run — retains last-known data so the content
  // doesn't vanish when the run leaves the liveruns query.
  const [snapshot, setSnapshot] = useState<Pace | null>(null);
  useEffect(() => {
    if (livePace) setSnapshot(livePace);
  }, [livePace]);

  // Prefer live data while the run exists; fall back to the snapshot during
  // dismissal. livePace takes priority, so opening a different run never
  // flashes stale content.
  const pace = livePace ?? snapshot;

  // Gracefully dismiss when the selected run is removed from liveruns.
  useEffect(() => {
    if (isPresented && selectedWorldId && !livePace) {
      onDismiss();
    }
  }, [isPresented, selectedWorldId, livePace, onDismiss]);

  const splits = useMemo(() => {
    if (!pace) return [];
    const completedEvents = new Map(pace.eventList.map((event) => [event.name, event.time]));
    return getSortedEventsWithTimes(completedEvents);
  }, [pace]);

  return (
    <BottomSheet isPresented={isPresented} onDismiss={onDismiss} showDragIndicator={false}>
      {pace && (
        <Column spacing={12} style={{ paddingTop: 8, paddingBottom: 8 }}>
          {/* PLAYER AVATAR + NAME + TWITCH BUTTON */}
          <Row alignment="center" spacing={8}>
            <Row alignment="center" spacing={8} onPress={() => router.push(`/stats/player/${pace.nickname}`)}>
              <RNHostView matchContents>
                <Image source={{ uri: `https://mc-heads.net/avatar/${pace.uuid}` }} style={{ height: 50, width: 50 }} />
              </RNHostView>
              <Text numberOfLines={1} textStyle={{ fontSize: 24, fontWeight: "bold" }}>
                {pace.nickname}
              </Text>
            </Row>
            <Spacer flexible />
            {pace.twitch && (
              <RNHostView matchContents>
                <TwitchButton twitch={pace.twitch} vodId={pace.vodId} vodOffset={pace.vodOffset} />
              </RNHostView>
            )}
          </Row>

          {/* CURRENT PACE SPLIT */}
          <Row alignment="center" spacing={8} style={{ paddingTop: 12, paddingBottom: 12 }}>
            <Text numberOfLines={1} textStyle={{ fontSize: 32, fontWeight: "bold" }}>
              {pace.splitName}
            </Text>
            <Spacer flexible />
            <Text textStyle={{ fontSize: 32, fontWeight: "bold" }}>{msToTime(pace.time)}</Text>
          </Row>

          {/* ALL SPLITS */}
          {splits.map((event, index) => {
            const { splitName, splitTime } = event;
            const isCompleted = splitTime !== "N/A";
            const color = isCompleted ? undefined : incompleteColor;

            return (
              <Row key={index} alignment="center" spacing={8}>
                <Text numberOfLines={1} textStyle={{ fontSize: 18, color }}>
                  {splitName}
                </Text>
                <Spacer flexible />
                <Text textStyle={{ fontSize: 18, color }}>{isCompleted ? msToTime(splitTime) : "--:--"}</Text>
              </Row>
            );
          })}
        </Column>
      )}
    </BottomSheet>
  );
};

PaceBottomSheet.displayName = "PaceBottomSheet";

export default PaceBottomSheet;
