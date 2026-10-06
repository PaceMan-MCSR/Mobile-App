import PaceBottomSheetContent from "@/components/pace-bottom-sheet-content";
import { useColorsForUI } from "@/hooks/use-colors-for-ui";
import { Pace } from "@/lib/types/Pace";
import { Host, RNHostView } from "@expo/ui";
import { ModalBottomSheet } from "@expo/ui/jetpack-compose";
import { StyleSheet } from "react-native";

interface PaceBottomSheetProps {
  selectedPace: Pace | null;
  onDismiss: () => void;
}

export default function PaceBottomSheet({ selectedPace, onDismiss }: PaceBottomSheetProps) {
  const { backgroundColor } = useColorsForUI();

  if (!selectedPace) return null;

  return (
    <Host pointerEvents="none" style={StyleSheet.absoluteFill}>
      <ModalBottomSheet
        containerColor={backgroundColor}
        onDismissRequest={onDismiss}
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
