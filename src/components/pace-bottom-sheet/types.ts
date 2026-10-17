import { Pace } from "@/lib/types/Pace";

export interface PaceBottomSheetProps {
  selectedPace: Pace;
  isPresented: boolean;
  onDismissRequest: () => void;
  onDismiss: () => void;
}
