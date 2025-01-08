import { useState, useCallback } from 'react';
import { FilterState, SortConfig, defaultFilterState, defaultSortConfig } from '@/components/projects/types/filters';

export function useProjectFilters() {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSortConfig);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterState);
  }, []);

  const updateSort = useCallback((column: string) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  return {
    filters,
    sortConfig,
    updateFilters,
    resetFilters,
    updateSort
  };
}