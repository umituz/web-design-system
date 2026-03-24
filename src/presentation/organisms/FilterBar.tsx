/**
 * FilterBar Component (Organism)
 * @description Mobile filter bar with search, categories, tags, and sort with optimized performance
 */

import { useState, useCallback, memo } from 'react';
import React from 'react';
import type { BaseProps } from '../../domain/types';

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export interface SortOption {
  id: string;
  name: string;
}

export interface FilterBarProps extends BaseProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string) => void;
  categories: Category[];
  popularTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOptions: readonly SortOption[] | SortOption[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

// Memoize category button component
const CategoryButton = memo<{
  category: Category;
  selectedCategory: string | null;
  onCategoryChange: (category: string) => void;
}>(({ category, selectedCategory, onCategoryChange }) => {
  const Icon = category.icon;
  const isActive = selectedCategory === category.id;

  const handleClick = useCallback(() => {
    onCategoryChange(category.id);
  }, [category.id, onCategoryChange]);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all transition-theme ${
        isActive
          ? 'bg-primary-light text-text-primary font-medium'
          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
      }`}
      type="button"
      aria-pressed={isActive}
    >
      <Icon size={14} />
      <span>{category.name}</span>
    </button>
  );
});

CategoryButton.displayName = 'CategoryButton';

// Memoize tag button component
const TagButton = memo<{
  tag: string;
  isSelected: boolean;
  onTagToggle: (tag: string) => void;
}>(({ tag, isSelected, onTagToggle }) => {
  const handleClick = useCallback(() => {
    onTagToggle(tag);
  }, [tag, onTagToggle]);

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all transition-theme ${
        isSelected
          ? 'bg-primary-light text-text-primary'
          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
      }`}
      type="button"
      aria-pressed={isSelected}
    >
      {tag}
    </button>
  );
});

TagButton.displayName = 'TagButton';

export const FilterBar = memo<FilterBarProps>(({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  onCategoryChange,
  categories,
  popularTags,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange,
  sortOptions,
  hasActiveFilters,
  onClearFilters,
  className,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const handleToggleFilters = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  }, [onSortChange]);

  const handleClearFilters = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  return (
    <div className={`lg:hidden mb-4 space-y-3 ${className || ''}`}>
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary text-text-primary rounded-lg border border-border focus:border-primary-light focus:outline-none placeholder-text-secondary/50 transition-theme text-sm"
          aria-label="Search"
        />
      </div>

      {/* Filter Toggle + Sort + Clear Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleToggleFilters}
          className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary text-text-primary rounded-lg border border-border hover:border-primary-light transition-all text-sm font-medium transition-theme"
          type="button"
          aria-expanded={isFilterOpen}
          aria-label="Toggle filters"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
          Filters
          {(selectedCategory || selectedTags.length > 0) && (
            <span className="ml-1 px-2 py-0.5 bg-primary-light text-text-primary text-xs rounded-full">
              {[selectedCategory, ...selectedTags].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-3 py-2.5 bg-bg-secondary text-text-primary rounded-lg border border-border focus:border-primary-light focus:outline-none transition-theme text-sm"
          aria-label="Sort by"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-2.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
            type="button"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="bg-bg-card rounded-xl p-4 border border-border space-y-4 transition-theme">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  selectedCategory={selectedCategory}
                  onCategoryChange={onCategoryChange}
                />
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Popular Tags</h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <TagButton
                  key={tag}
                  tag={tag}
                  isSelected={selectedTags.includes(tag)}
                  onTagToggle={onTagToggle}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';
