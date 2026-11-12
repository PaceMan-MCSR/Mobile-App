import { Pace } from "@/lib/types/Pace";
import { ReactNode } from "react";

export type SelectionState =
  | { phase: "closed"; pace: null; selectionId: number }
  | { phase: "open" | "closing"; pace: Pace; selectionId: number };

export type SelectionAction =
  | { type: "select"; pace: Pace }
  | { type: "sync"; runs: Pace[] }
  | { type: "dismiss" }
  | { type: "finishDismiss"; selectionId: number };

export interface SelectedPaceContextValue {
  selectedPace: Pace | null;
  isPresented: boolean;
  selectionId: number;
  selectPace: (pace: Pace) => void;
  syncWithRuns: (runs: Pace[]) => void;
  requestDismiss: () => void;
  finishDismiss: (selectionId: number) => void;
}

export interface SelectedPaceProviderProps {
  children: ReactNode;
}
