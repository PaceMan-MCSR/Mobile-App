import PaceBottomSheetContent from "@/components/pace-bottom-sheet-content";
import { Pace } from "@/lib/types/Pace";
import { Host, RNHostView } from "@expo/ui";
import { BottomSheet, Group } from "@expo/ui/swift-ui";
import { presentationDetents, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from "react-native";

interface PaceBottomSheetProps {
  selectedPace: Pace | null;
  onDismiss: () => void;
}

export default function PaceBottomSheet({ selectedPace, onDismiss }: PaceBottomSheetProps) {
  const { width } = useWindowDimensions();
  const [measurement, setMeasurement] = useState<{ worldId: string; height: number } | null>(null);
  const contentHeight = selectedPace && measurement?.worldId === selectedPace.worldId ? measurement.height : null;
  const detent = { height: contentHeight ?? 1 };

  const handleContentLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (!selectedPace || layout.height <= 0) return;
    const height = Math.ceil(layout.height);
    setMeasurement((current) =>
      current?.worldId === selectedPace.worldId && current.height === height
        ? current
        : { worldId: selectedPace.worldId, height }
    );
  };

  return (
    <>
      {selectedPace ? (
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ position: "absolute", left: -width, top: 0, opacity: 0, width }}
        >
          <PaceBottomSheetContent selectedPace={selectedPace} onLayout={handleContentLayout} />
        </View>
      ) : null}
      <Host pointerEvents="none" style={StyleSheet.absoluteFill}>
        <BottomSheet
          isPresented={selectedPace !== null && contentHeight !== null}
          onIsPresentedChange={(isPresented) => {
            if (!isPresented && (!selectedPace || contentHeight !== null)) onDismiss();
          }}
        >
          <Group
            modifiers={[presentationDetents([detent], { selection: detent }), presentationDragIndicator("hidden")]}
          >
            {selectedPace ? (
              <RNHostView matchContents={{ vertical: true, horizontal: false }} style={{ width }}>
                <PaceBottomSheetContent selectedPace={selectedPace} />
              </RNHostView>
            ) : null}
          </Group>
        </BottomSheet>
      </Host>
    </>
  );
}
