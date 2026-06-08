/**
 * FilterBar Component (Organism)
 * @description Mobile filter bar with search, categories, tags, and sort
 */

import { useState, useCallback, memo, type ChangeEvent, type ComponentType } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: ComponentType<{ className?: string; size?: number }>;
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
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors',
        isActive
          ? 'bg-primary font-medium text-primary-foreground'
          : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon size={14} />
      <span>{category.name}</span>
    </button>
  );
});
CategoryButton.displayName = 'CategoryButton';

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
      type="button"
      onClick={handleClick}
      aria-pressed={isSelected}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
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

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [setSearchQuery]
  );

  const handleToggleFilters = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  const handleSortChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value),
    [onSortChange]
  );

  const handleClearFilters = useCallback(() => onClearFilters(), [onClearFilters]);

  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length;

  return (
    <div className={cn('mb-4 space-y-3 lg:hidden', className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search"
          className="w-full rounded-lg border border-input bg-secondary py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleToggleFilters}
          aria-expanded={isFilterOpen}
          aria-label="Toggle filters"
          className="flex items-center gap-2 rounded-lg border border-input bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={handleSortChange}
          aria-label="Sort by"
          className="rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear All
          </button>
        )}
      </div>

      {isFilterOpen && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-4">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Categories</h4>
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

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Popular Tags</h4>
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
