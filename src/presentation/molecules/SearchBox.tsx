/**
 * SearchBox Component (Molecule)
 * @description Input with search icon
 */

import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';
import { Input } from '../atoms/Input';
import { Icon } from '../atoms/Icon';

export interface SearchBoxProps extends BaseProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ placeholder = 'Search...', value, onChange, className, ...props }, ref) => {
    return (
      <div className={cn('relative', className)} {...props}>
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size="sm"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </Icon>
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn('pl-9', value && 'pr-8')}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => onChange?.('')}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    );
  }
);

SearchBox.displayName = 'SearchBox';
