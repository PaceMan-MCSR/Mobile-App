import { SelectionState } from "../types";

export function finishDismiss(state: SelectionState, selectionId: number): SelectionState {
  // A late native callback must not clear a more recent selection.
  if (state.phase === "closed" || state.selectionId !== selectionId) return state;
  return { phase: "closed", pace: null, selectionId: state.selectionId };
}
