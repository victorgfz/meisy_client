import { useState, useRef, useEffect } from 'react';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, X, ChevronDown, Check } from 'lucide-react';
import type { FilterOption, SortOption } from '../hooks/use-filter-sort';

export interface FilterGroup {
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  // Filtering
  filterGroups?: FilterGroup[];
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;

  // Sorting
  sortOptions?: SortOption[];
  activeSort?: string;
  onSortChange?: (sort: string) => void;

  // Clear
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function FilterBar({
  filterGroups = [],
  activeFilters = [],
  onFilterChange,
  sortOptions = [],
  activeSort = '',
  onSortChange,
  onClearFilters,
  hasActiveFilters = false,
}: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleFilter = (value: string) => {
    if (!onFilterChange) return;
    const newFilters = activeFilters.includes(value)
      ? activeFilters.filter((f) => f !== value)
      : [...activeFilters, value];
    onFilterChange(newFilters);
  };

  const handleSortSelect = (value: string) => {
    onSortChange?.(value);
    setIsSortOpen(false);
  };

  const handleRemoveFilter = (value: string) => {
    if (!onFilterChange) return;
    onFilterChange(activeFilters.filter((f) => f !== value));
  };

  const getFilterLabel = (value: string) => {
    for (const group of filterGroups) {
      const found = group.options.find((o) => o.value === value);
      if (found) return found.label;
    }
    return value;
  };

  const activeSortOption = sortOptions.find((o) => o.value === activeSort);

  const allFilterOptions = filterGroups.flatMap((g) => g.options);
  const showFilterButton = allFilterOptions.length > 0;
  const showSortButton = sortOptions.length > 0;

  if (!showFilterButton && !showSortButton) return null;

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter button */}
        {showFilterButton && (
          <div ref={filterRef} className="relative">
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all border ${
                hasActiveFilters
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-white border-gray-100 text-text-secondary hover:border-gray-200 hover:text-text-primary'
              }`}
            >
              <Filter size={15} />
              Filtrar
              {hasActiveFilters && (
                <span className="bg-primary text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Filter dropdown with groups */}
            {isFilterOpen && (
              <div className="absolute top-8 left-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-72 overflow-y-auto p-1.5">
                  {filterGroups.map((group, groupIdx) => (
                    <div key={group.label}>
                      {groupIdx > 0 && <div className="h-px bg-gray-100 my-1.5 mx-2" />}
                      <div className="px-3 pt-2 pb-1">
                        <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                          {group.label}
                        </span>
                      </div>
                      {group.options.map((option) => {
                        const isActive = activeFilters.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleToggleFilter(option.value)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left ${
                              isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-text-primary hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-colors ${
                                isActive
                                  ? 'bg-primary border-primary'
                                  : 'border-gray-300'
                              }`}
                            >
                              {isActive && <Check size={11} className="text-white" />}
                            </div>
                            <span className="truncate">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sort button — compact with direction arrow */}
        {showSortButton && (
          <div ref={sortRef} className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-medium transition-all border ${
                activeSort
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-white border-gray-100 text-text-secondary hover:border-gray-200 hover:text-text-primary'
              }`}
            >
              {activeSortOption ? (
                <>
                  {activeSortOption.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  <span className="text-xs">{activeSortOption.shortLabel}</span>
                </>
              ) : (
                <>
                  <ArrowUpDown size={14} />
                  <span className="text-xs">Ordenar</span>
                </>
              )}
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Sort dropdown */}
            {isSortOpen && (
              <div className="absolute top-8 right-0 sm:left-0 sm:right-auto mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1.5">
                  {sortOptions.map((option) => {
                    const isActive = activeSort === option.value;
                    const DirectionIcon = option.direction === 'asc' ? ArrowUp : ArrowDown;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSortSelect(option.value)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-text-primary hover:bg-gray-50'
                        }`}
                      >
                        <DirectionIcon size={13} className="shrink-0" />
                        <span className="flex-1">{option.shortLabel}</span>
                        {isActive && <Check size={13} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-2 rounded-2xl text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={13} />
            Limpar
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {activeFilters.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-medium rounded-full"
            >
              {getFilterLabel(value)}
              <button
                onClick={() => handleRemoveFilter(value)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}