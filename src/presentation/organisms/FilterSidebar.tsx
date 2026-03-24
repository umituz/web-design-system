/**
 * FilterSidebar Component (Organism)
 * @description Desktop sidebar with search, categories, tags, and sort options
 */

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

export interface FilterSidebarProps extends BaseProps {
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
  children?: React.ReactNode;
}

export const FilterSidebar = ({
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
  children,
  className,
}: FilterSidebarProps) => {
  return (
    <aside className={`hidden lg:block w-64 flex-shrink-0 ${className || ''}`}>
      <div className="sticky top-24 space-y-6">
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary text-text-primary rounded-lg border border-border focus:border-primary-light focus:outline-none placeholder-text-secondary/50 transition-theme text-sm"
            aria-label="Search"
          />
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all transition-theme ${
                    isActive
                      ? 'bg-primary-light text-text-primary font-medium'
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`}
                  type="button"
                  aria-pressed={isActive}
                >
                  <Icon size={16} />
                  <span className="flex-1 text-left">{category.name}</span>
                  <span className={`text-xs ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all transition-theme ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-light text-text-primary'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
                type="button"
                aria-pressed={selectedTags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-bg-secondary text-text-primary rounded-lg border border-border focus:border-primary-light focus:outline-none transition-theme text-sm"
            aria-label="Sort by"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Content */}
        {children}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-secondary text-text-secondary rounded-lg border border-border hover:border-primary-light hover:text-text-primary transition-all text-sm font-medium transition-theme"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
};
