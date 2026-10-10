import { Pace } from "@/lib/types/Pace";
import { SelectionState } from "../types";

export function selectPace(state: SelectionState, pace: Pace): SelectionState {
  // Finish the current presentation before accepting another selection.
  if (state.phase !== "closed") return state;
  return { phase: "open", pace, selectionId: state.selectionId + 1 };
}
