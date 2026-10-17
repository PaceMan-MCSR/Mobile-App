import { PaceBottomSheetProps } from "@/components/pace-bottom-sheet/types";
import TwitchButton from "@/components/twitch-button";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { getSortedEventsWithTimes, msToTime } from "@/lib/utils/frontend-converters";
import { Host } from "@expo/ui";
import {
  Box,
  Column,
  ModalBottomSheet,
  ModalBottomSheetRef,
  RNHostView,
  Row,
  Text,
} from "@expo/ui/jetpack-compose";
import { clickable, fillMaxWidth, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";

export default function PaceBottomSheet({
  selectedPace,
  isPresented,
  onDismissRequest,
  onDismiss,
}: PaceBottomSheetProps) {
  const { backgroundColor, tintColor } = useColorsForUI();
  const dark = tintColor === "#FFFFFF";
  const router = useRouter();
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const splits = useMemo(
    () => getSortedEventsWithTimes(new Map(selectedPace.eventList.map((event) => [event.name, event.time]))),
    [selectedPace.eventList]
  );

  useEffect(() => {
    if (isPresented) return;
    let cancelled = false;
    const sheet = sheetRef.current;
    if (!sheet) {
      onDismiss();
      return;
    }
    // Retain the modal until its native hide animation completes.
    void sheet
      .hide()
      .then(() => {
        if (!cancelled) onDismiss();
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error("Failed to dismiss the selected pace sheet", error);
      });
    return () => {
      cancelled = true;
    };
  }, [isPresented, onDismiss]);

  const titleColor = dark ? "#FFFFFF" : "#000000";
  const completedColor = dark ? "#ECEDEE" : "#000000";
  const pendingColor = dark ? "#6B7280" : "#A0A0A0";

  return (
    <Host pointerEvents="none" style={StyleSheet.absoluteFill}>
      <ModalBottomSheet
        ref={sheetRef}
        initialFullyExpanded
        skipPartiallyExpanded
        sheetGesturesEnabled
        showDragHandle={false}
        containerColor={backgroundColor}
        onDismissRequest={onDismissRequest}
        properties={{ shouldDismissOnBackPress: true, shouldDismissOnClickOutside: true }}
      >
        <Box modifiers={[fillMaxWidth()]}>
          <Column modifiers={[fillMaxWidth(), padding(16, 28, 16, 32)]}>
            <Row horizontalArrangement="spaceBetween" verticalAlignment="center" modifiers={[fillMaxWidth()]}>
              <Row
                verticalAlignment="center"
                modifiers={[weight(1), clickable(() => router.push(`/stats/player/${selectedPace.nickname}`))]}
              >
                <RNHostView matchContents>
                  <ExpoImage
                    source={{ uri: `https://mc-heads.net/avatar/${selectedPace.uuid}` }}
                    style={{ width: 50, height: 50 }}
                    accessibilityLabel={`${selectedPace.nickname}'s avatar`}
                  />
                </RNHostView>
                <Text
                  color={titleColor}
                  maxLines={1}
                  overflow="ellipsis"
                  style={{ fontSize: 24, fontWeight: "bold" }}
                  modifiers={[padding(8, 0, 8, 0), weight(1)]}
                >
                  {selectedPace.nickname}
                </Text>
              </Row>
              {selectedPace.twitch ? (
                <RNHostView matchContents>
                  <TwitchButton
                    twitch={selectedPace.twitch}
                    vodId={!selectedPace.isLive ? selectedPace.vodId : null}
                    vodOffset={!selectedPace.isLive ? selectedPace.vodOffset : null}
                  />
                </RNHostView>
              ) : null}
            </Row>

            <Row verticalAlignment="center" modifiers={[fillMaxWidth(), padding(0, 24, 0, 24)]}>
              <Text
                color={titleColor}
                maxLines={2}
                style={{ fontSize: 28, fontWeight: "bold" }}
                modifiers={[weight(0.6)]}
              >
                {selectedPace.splitName}
              </Text>
              <Text
                color={titleColor}
                style={{ fontSize: 28, fontWeight: "bold", textAlign: "right" }}
                modifiers={[weight(0.4)]}
              >
                {msToTime(selectedPace.time)}
              </Text>
            </Row>

            <Column verticalArrangement={{ spacedBy: 12 }} modifiers={[fillMaxWidth()]}>
              {splits.map(({ splitName, splitTime }, index) => {
                const isCompleted = splitTime !== "N/A";
                const color = isCompleted ? completedColor : pendingColor;

                return (
                  <Row key={`${splitName}-${index}`} verticalAlignment="center" modifiers={[fillMaxWidth()]}>
                    <Text color={color} style={{ fontSize: 18 }} modifiers={[weight(0.65)]}>
                      {splitName}
                    </Text>
                    <Text color={color} style={{ fontSize: 18, textAlign: "right" }} modifiers={[weight(0.35)]}>
                      {isCompleted ? msToTime(splitTime) : "--:--"}
                    </Text>
                  </Row>
                );
              })}
            </Column>
          </Column>
        </Box>
      </ModalBottomSheet>
    </Host>
  );
}
