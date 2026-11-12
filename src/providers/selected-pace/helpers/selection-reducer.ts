import { SelectionAction, SelectionState } from "../types";
import { finishDismiss } from "./finish-dismiss";
import { requestDismiss } from "./request-dismiss";
import { selectPace } from "./select-pace";
import { syncWithRuns } from "./sync-with-runs";

export function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case "select":
      return selectPace(state, action.pace);
    case "sync":
      return syncWithRuns(state, action.runs);
    case "dismiss":
      return requestDismiss(state);
    case "finishDismiss":
      return finishDismiss(state, action.selectionId);
  }
}
