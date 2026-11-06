import type { ReactNode } from 'react';
import { SearchBox } from '../molecules/SearchBox';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface FilterBarSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface FilterBarProps extends BaseProps {
  search?: FilterBarSearch;
  children?: ReactNode;
  actions?: ReactNode;
}

export const FilterBar = ({ search, children, actions, className, ...props }: FilterBarProps) => {
  return (
    <div className={cn('udb-filter-bar flex flex-wrap items-center gap-3 mb-4', className)} {...props}>
      {search && (
        <div className="udb-filter-bar__search flex-1 sm:max-w-xs min-w-[200px]">
          <SearchBox
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder}
          />
        </div>
      )}
      {children && (
        <div className="udb-filter-bar__fields flex flex-wrap items-center gap-2">
          {children}
        </div>
      )}
      {actions && (
        <div className="udb-filter-bar__actions ml-auto flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

FilterBar.displayName = 'FilterBar';
