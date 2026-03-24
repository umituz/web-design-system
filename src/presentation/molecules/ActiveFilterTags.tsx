/**
 * ActiveFilterTags Component (Molecule)
 * @description Display active filters with remove buttons
 */

import type { BaseProps } from '../../domain/types';

export interface ActiveFilterTagsProps extends BaseProps {
  selectedCategory: string | null;
  categories: Array<{ id: string; name: string }>;
  selectedTags: string[];
  onCategoryRemove: () => void;
  onTagRemove: (tag: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterTags = ({
  selectedCategory,
  categories,
  selectedTags,
  onCategoryRemove,
  onTagRemove,
  onClearAll,
  className,
}: ActiveFilterTagsProps) => {
  const categoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.name
    : null;

  if (!selectedCategory && selectedTags.length === 0) {
    return null;
  }

  return (
    <div className={`hidden lg:flex flex-wrap items-center gap-2 mb-4 md:mb-6 ${className || ''}`}>
      <span className="text-sm text-text-secondary">Active filters:</span>

      {/* Category Tag */}
      {categoryName && (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-light text-text-primary rounded-full text-xs font-medium">
          {categoryName}
          <button
            onClick={onCategoryRemove}
            className="ml-1 hover:opacity-70 transition-opacity"
            aria-label={`Remove ${categoryName} filter`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </span>
      )}

      {/* Tag Buttons */}
      {selectedTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-bg-secondary text-text-primary rounded-full text-xs font-medium border border-border"
        >
          {tag}
          <button
            onClick={() => onTagRemove(tag)}
            className="ml-1 hover:opacity-70 transition-opacity"
            aria-label={`Remove ${tag} filter`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="px-3 py-1.5 text-primary-light hover:underline text-xs font-medium"
        type="button"
      >
        Clear all
      </button>
    </div>
  );
};
