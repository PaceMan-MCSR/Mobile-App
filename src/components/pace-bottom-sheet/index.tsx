import { PaceBottomSheetProps } from "@/components/pace-bottom-sheet/types";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { getSortedEventsWithTimes, msToTime } from "@/lib/utils/frontend-converters";
import { Host } from "@expo/ui";
import { BottomSheet, Button, Group, HStack, RNHostView, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  font,
  foregroundColor,
  frame,
  lineLimit,
  multilineTextAlignment,
  onGeometryChange,
  padding,
  presentationBackground,
  presentationDragIndicator,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Linking, StyleSheet, useWindowDimensions } from "react-native";

export default function PaceBottomSheet({
  selectedPace,
  isPresented,
  onDismissRequest,
  onDismiss,
}: PaceBottomSheetProps) {
  const router = useRouter();
  const pendingProfileRoute = useRef<string | null>(null);
  const { width } = useWindowDimensions();
  const [nativeWidth, setNativeWidth] = useState(0);
  const { tintColor } = useColorsForUI();
  const dark = tintColor === "#FFFFFF";
  const avatarUrl = `https://mc-heads.net/avatar/${selectedPace.uuid}`;
  const splits = useMemo(
    () => getSortedEventsWithTimes(new Map(selectedPace.eventList.map((event) => [event.name, event.time]))),
    [selectedPace.eventList]
  );
  const contentWidth = Math.max(0, (nativeWidth || width) - 32);
  const handleDismiss = useCallback(() => {
    onDismiss();
    const route = pendingProfileRoute.current;
    pendingProfileRoute.current = null;
    if (route) router.push(route as any);
  }, [onDismiss, router]);
  const openProfile = useCallback(() => {
    pendingProfileRoute.current = `/stats/player/${selectedPace.nickname}`;
    onDismissRequest();
  }, [onDismissRequest, selectedPace.nickname]);

  const titleColor = dark ? "#FFFFFF" : "#000000";
  const completedColor = dark ? "#ECEDEE" : "#000000";
  const pendingColor = dark ? "#6B7280" : "#A0A0A0";

  return (
    <Host pointerEvents="none" style={StyleSheet.absoluteFill}>
      <BottomSheet
        fitToContents
        isPresented={isPresented}
        onIsPresentedChange={(presented) => {
          if (!presented) onDismissRequest();
        }}
        onDismiss={handleDismiss}
      >
        <Group modifiers={[presentationDragIndicator("hidden"), presentationBackground("#1F293788")]}>
          <VStack
            spacing={0}
            modifiers={[
              padding({ horizontal: 16, top: 28, bottom: 44 }),
              frame({ maxWidth: Infinity }),
              onGeometryChange(({ width: measuredWidth }) => {
                setNativeWidth((currentWidth) =>
                  Math.abs(currentWidth - measuredWidth) > 0.5 ? measuredWidth : currentWidth
                );
              }),
            ]}
          >
            <HStack spacing={8} alignment="center" modifiers={[frame({ width: contentWidth })]}>
              <Button
                onPress={openProfile}
                modifiers={[
                  buttonStyle("plain"),
                  frame({ maxWidth: contentWidth - (selectedPace.twitch ? 128 : 0), alignment: "leading" }),
                ]}
              >
                <HStack spacing={8} alignment="center">
                  <RNHostView matchContents>
                    <ExpoImage source={{ uri: avatarUrl }} style={{ width: 50, height: 50 }} />
                  </RNHostView>
                  <Text modifiers={[font({ size: 24, weight: "bold" }), foregroundColor(titleColor), lineLimit(1)]}>
                    {selectedPace.nickname}
                  </Text>
                </HStack>
              </Button>
              <Spacer />
              {selectedPace.twitch ? (
                <Button
                  label={selectedPace.twitch}
                  onPress={() => void Linking.openURL(`https://twitch.tv/${selectedPace.twitch}`)}
                  modifiers={[buttonStyle("glassProminent"), tint("#9146FF"), lineLimit(1)]}
                />
              ) : null}
            </HStack>

            <HStack
              spacing={0}
              alignment="center"
              modifiers={[frame({ width: contentWidth }), padding({ top: 24, bottom: 24 })]}
            >
              <Text
                modifiers={[
                  frame({ maxWidth: contentWidth * 0.65, alignment: "leading" }),
                  font({ size: 36, weight: "bold" }),
                  foregroundColor(titleColor),
                  lineLimit(2),
                ]}
              >
                {selectedPace.splitName}
              </Text>
              <Spacer />
              <Text
                modifiers={[
                  font({ size: 36, weight: "bold" }),
                  foregroundColor(titleColor),
                  multilineTextAlignment("trailing"),
                ]}
              >
                {msToTime(selectedPace.time)}
              </Text>
            </HStack>

            <VStack spacing={12} modifiers={[frame({ width: contentWidth })]}>
              {splits.map(({ splitName, splitTime }, index) => {
                const isCompleted = splitTime !== "N/A";
                const color = isCompleted ? completedColor : pendingColor;

                return (
                  <HStack
                    key={`${splitName}-${index}`}
                    spacing={0}
                    alignment="center"
                    modifiers={[frame({ width: contentWidth })]}
                  >
                    <Text
                      modifiers={[
                        frame({ maxWidth: contentWidth * 0.65, alignment: "leading" }),
                        font({ size: 18 }),
                        foregroundColor(color),
                      ]}
                    >
                      {splitName}
                    </Text>
                    <Spacer />
                    <Text modifiers={[font({ size: 18 }), foregroundColor(color), multilineTextAlignment("trailing")]}>
                      {isCompleted ? msToTime(splitTime) : "--:--"}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </VStack>
        </Group>
      </BottomSheet>
    </Host>
  );
}
