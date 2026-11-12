import { createContext } from "react";
import { SelectedPaceContextValue } from "./types";

export const SelectedPaceContext = createContext<SelectedPaceContextValue | undefined>(undefined);
