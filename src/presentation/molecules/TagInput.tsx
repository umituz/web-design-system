/**
 * TagInput Component (Molecule)
 * @description Controlled free-form tag entry rendered as removable chips.
 * Type and press Enter (or comma) to commit, Backspace on an empty draft removes the last tag,
 * duplicates are ignored, and blur commits by default.
 */

import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../infrastructure/utils';
import { Chip } from './Chip';
import type { BaseProps } from '../../domain/types';

export interface TagInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'children' | 'size'>,
    BaseProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  /** Commit the draft on blur (default true). */
  commitOnBlur?: boolean;
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ className, tags, onTagsChange, commitOnBlur = true, disabled, placeholder, id, ...props }, ref) => {
    const [draft, setDraft] = useState('');

    const commit = () => {
      const value = draft.trim();
      if (value && !tags.includes(value)) onTagsChange([...tags, value]);
      setDraft('');
    };

    return (
      <div
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 text-sm',
          'ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            removable={!disabled}
            onRemove={disabled ? undefined : () => onTagsChange(tags.filter((t) => t !== tag))}
          />
        ))}
        <input
          ref={ref}
          id={id}
          value={draft}
          disabled={disabled}
          placeholder={tags.length === 0 ? placeholder : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              commit();
            }
            if (event.key === 'Backspace' && draft === '' && tags.length > 0 && !disabled) {
              onTagsChange(tags.slice(0, -1));
            }
          }}
          onBlur={commitOnBlur ? commit : undefined}
          className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          {...props}
        />
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
