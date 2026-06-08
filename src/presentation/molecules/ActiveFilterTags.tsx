/**
 * ActiveFilterTags Component (Molecule)
 * @description Display active filters with remove buttons
 */

import { X } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
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
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  if (!selectedCategory && selectedTags.length === 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Active filters"
      className={cn('mb-4 hidden flex-wrap items-center gap-2 md:mb-6 lg:flex', className)}
    >
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {categoryName && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          {categoryName}
          <button
            type="button"
            onClick={onCategoryRemove}
            aria-label={`Remove ${categoryName} filter`}
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      )}

      {selectedTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => onTagRemove(tag)}
            aria-label={`Remove ${tag} filter`}
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="px-3 py-1.5 text-xs font-medium text-primary underline-offset-4 transition-colors hover:underline"
      >
        Clear all
      </button>
    </div>
  );
};
