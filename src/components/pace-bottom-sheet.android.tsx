import PaceBottomSheetContent from "@/components/pace-bottom-sheet-content";
import { PaceBottomSheetProps } from "@/components/pace-bottom-sheet.types";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { Host, RNHostView } from "@expo/ui";
import { ModalBottomSheet, ModalBottomSheetRef } from "@expo/ui/jetpack-compose";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

export default function PaceBottomSheet({
  selectedPace,
  isPresented,
  onDismissRequest,
  onDismiss,
}: PaceBottomSheetProps) {
  const { backgroundColor } = useColorsForUI();
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  useEffect(() => {
    if (isPresented) return;
    let cancelled = false;
    const sheet = sheetRef.current;
    if (!sheet) {
      onDismiss();
      return;
    }
    // Retain both the modal and its content until the native hide animation completes.
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

  return (
    <Host pointerEvents="none" style={StyleSheet.absoluteFill}>
      <ModalBottomSheet
        ref={sheetRef}
        containerColor={backgroundColor}
        onDismissRequest={onDismissRequest}
        showDragHandle={false}
        sheetGesturesEnabled={false}
        properties={{ shouldDismissOnBackPress: true, shouldDismissOnClickOutside: true }}
      >
        <RNHostView matchContents>
          <PaceBottomSheetContent selectedPace={selectedPace} />
        </RNHostView>
      </ModalBottomSheet>
    </Host>
  );
}
