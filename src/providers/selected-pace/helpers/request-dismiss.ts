import { SelectionState } from "../types";

export function requestDismiss(state: SelectionState): SelectionState {
  return state.phase === "open" ? { ...state, phase: "closing" } : state;
}
