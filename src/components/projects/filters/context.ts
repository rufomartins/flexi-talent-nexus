import { createContext, useContext } from "react";
import type { FilterContextType } from "./types";

export const FilterContext = createContext<FilterContextType | null>(null);

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("Filter components must be used within a FilterProvider");
  }
  return context;
}