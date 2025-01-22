import { useState } from "react";
import type { ProjectFilters } from "./types";

export function useProjectFilters(initialFilters: Partial<ProjectFilters> = {}) {
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters);

  const updateFilter = (key: keyof ProjectFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    updateFilter,
    clearFilters,
  };
}