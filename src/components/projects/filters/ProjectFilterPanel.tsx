import { useCallback, useEffect, useState } from "react";
import { FilterContext } from "./context";
import type { FilterProps, FilterState } from "./types";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { StatusFilter } from "./components/StatusFilter";
import { SearchFilter } from "./components/SearchFilter";
import { ProjectManagerFilter } from "./components/ProjectManagerFilter";
import { CountryFilter } from "./components/CountryFilter";

const defaultFilters: FilterState = {
  dateRange: undefined,
  status: [],
  search: "",
  category: [],
  projectManagers: [],
  countries: [],
};

export function ProjectFilterPanel({ onChange, initialFilters, children }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    onChange?.(filters);
  }, [filters, onChange]);

  return (
    <FilterContext.Provider value={{ filters, updateFilter }}>
      <div className="space-y-4">
        <SearchFilter />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateRangeFilter />
          <StatusFilter />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectManagerFilter />
          <CountryFilter />
        </div>
        {children}
      </div>
    </FilterContext.Provider>
  );
}

// Attach sub-components for compound component pattern
ProjectFilterPanel.DateRange = DateRangeFilter;
ProjectFilterPanel.Status = StatusFilter;
ProjectFilterPanel.Search = SearchFilter;
ProjectFilterPanel.ProjectManager = ProjectManagerFilter;
ProjectFilterPanel.Country = CountryFilter;