import { useState, useMemo, useCallback } from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface SortOption {
  label: string;
  shortLabel: string;
  value: string;
  direction: 'asc' | 'desc';
}

interface UseFilterSortConfig<T> {
  items: T[];
  filterFn?: (item: T, activeFilters: string[]) => boolean;
  sortFn?: (a: T, b: T, sortKey: string) => number;
  defaultSort?: string;
}

interface UseFilterSortReturn<T> {
  processedItems: T[];
  activeFilters: string[];
  activeSort: string;
  setActiveFilters: (filters: string[]) => void;
  toggleFilter: (value: string) => void;
  setActiveSort: (sort: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useFilterSort<T>(config: UseFilterSortConfig<T>): UseFilterSortReturn<T> {
  const { items, filterFn, sortFn, defaultSort = '' } = config;

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState<string>(defaultSort);

  const toggleFilter = useCallback((value: string) => {
    setActiveFilters((prev) =>
      prev.includes(value)
        ? prev.filter((f) => f !== value)
        : [...prev, value]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const hasActiveFilters = activeFilters.length > 0;

  const processedItems = useMemo(() => {
    let result = [...items];

    // Apply filter
    if (hasActiveFilters && filterFn) {
      result = result.filter((item) => filterFn(item, activeFilters));
    }

    // Apply sort
    if (activeSort && sortFn) {
      result.sort((a, b) => sortFn(a, b, activeSort));
    }

    return result;
  }, [items, activeFilters, activeSort, filterFn, sortFn, hasActiveFilters]);

  return {
    processedItems,
    activeFilters,
    activeSort,
    setActiveFilters,
    toggleFilter,
    setActiveSort,
    clearFilters,
    hasActiveFilters,
  };
}
