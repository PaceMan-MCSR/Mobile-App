import { Pace } from "@/lib/types/Pace";
import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { selectionReducer } from "./helpers/selection-reducer";
import { SelectedPaceContextValue, SelectedPaceProviderProps } from "./types";

export const SelectedPaceContext = createContext<SelectedPaceContextValue | undefined>(undefined);

export const useSelectedPace = () => {
  const context = useContext(SelectedPaceContext);
  if (!context) throw new Error("useSelectedPace must be used within a SelectedPaceProvider");
  return context;
};

export const SelectedPaceProvider = ({ children }: SelectedPaceProviderProps) => {
  const [state, dispatch] = useReducer(selectionReducer, { phase: "closed", pace: null, selectionId: 0 });
  const selectPace = useCallback((pace: Pace) => dispatch({ type: "select", pace }), []);
  const syncWithRuns = useCallback((runs: Pace[]) => dispatch({ type: "sync", runs }), []);
  const requestDismiss = useCallback(() => dispatch({ type: "dismiss" }), []);
  const finishDismiss = useCallback((selectionId: number) => dispatch({ type: "finishDismiss", selectionId }), []);
  const value = useMemo(
    () => ({
      selectedPace: state.pace,
      isPresented: state.phase === "open",
      selectionId: state.selectionId,
      selectPace,
      syncWithRuns,
      requestDismiss,
      finishDismiss,
    }),
    [state, selectPace, syncWithRuns, requestDismiss, finishDismiss]
  );

  return <SelectedPaceContext.Provider value={value}>{children}</SelectedPaceContext.Provider>;
};
