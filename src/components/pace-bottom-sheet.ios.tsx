import PaceBottomSheetContent from "@/components/pace-bottom-sheet-content";
import { PaceBottomSheetProps } from "@/components/pace-bottom-sheet.types";
import { Host, RNHostView } from "@expo/ui";
import { BottomSheet, Group } from "@expo/ui/swift-ui";
import { presentationDetents, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from "react-native";

export default function PaceBottomSheet({
  selectedPace,
  isPresented,
  onDismissRequest,
  onDismiss,
}: PaceBottomSheetProps) {
  const { width } = useWindowDimensions();
  const [measurement, setMeasurement] = useState<{ worldId: string; height: number } | null>(null);
  const contentHeight = measurement?.worldId === selectedPace.worldId ? measurement.height : null;
  const detent = { height: contentHeight ?? 1 };
  const requestedPresentation = useRef(false);

  useEffect(() => {
    if (isPresented && contentHeight !== null) requestedPresentation.current = true;
    // Nothing native needs dismissing if selection closed before measurement completed.
    if (!isPresented && !requestedPresentation.current) onDismiss();
  }, [isPresented, contentHeight, onDismiss]);

  const handleContentLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (layout.height <= 0) return;
    const height = Math.ceil(layout.height);
    setMeasurement((current) =>
      current?.worldId === selectedPace.worldId && current.height === height
        ? current
        : { worldId: selectedPace.worldId, height }
    );
  };

  return (
    <>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ position: "absolute", left: -width, top: 0, opacity: 0, width }}
      >
        <PaceBottomSheetContent selectedPace={selectedPace} onLayout={handleContentLayout} />
      </View>
      <Host pointerEvents="none" style={StyleSheet.absoluteFill}>
        <BottomSheet
          isPresented={isPresented && contentHeight !== null}
          onIsPresentedChange={(presented) => {
            if (!presented) onDismissRequest();
          }}
          onDismiss={onDismiss}
        >
          <Group
            modifiers={[presentationDetents([detent], { selection: detent }), presentationDragIndicator("hidden")]}
          >
            <RNHostView matchContents={{ vertical: true, horizontal: false }} style={{ width }}>
              <PaceBottomSheetContent selectedPace={selectedPace} />
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </>
  );
}
