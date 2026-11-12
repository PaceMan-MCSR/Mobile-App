import { Pace } from "@/lib/types/Pace";
import { SelectionState } from "../types";

export function syncWithRuns(state: SelectionState, runs: Pace[]): SelectionState {
  if (state.phase !== "open") return state;
  const pace = runs.find((run) => run.worldId === state.pace.worldId);
  if (!pace) return { ...state, phase: "closing" };
  return pace === state.pace ? state : { ...state, pace };
}
