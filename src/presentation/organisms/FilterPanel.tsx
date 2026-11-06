import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps } from '../../domain/types';

export interface FilterPanelProps extends BaseProps {
  title?: string;
  onClear?: () => void;
  clearDisabled?: boolean;
  clearLabel?: string;
  children: ReactNode;
}

export function FilterPanel({
  title = 'Filters',
  onClear,
  clearDisabled,
  clearLabel = 'Clear all',
  children,
  className,
}: FilterPanelProps) {
  return (
    <aside
      className={cn(
        'udb-filter-panel bg-card border border-border rounded-xl p-4 text-card-foreground',
        className
      )}
      aria-label={title}
    >
      <div className="udb-filter-panel__header flex items-center justify-between mb-3">
        <span className="udb-filter-panel__title text-sm font-bold">{title}</span>
        {onClear !== undefined && (
          <button
            type="button"
            className="udb-filter-panel__clear text-xs font-medium text-primary hover:underline disabled:opacity-45 disabled:no-underline cursor-pointer disabled:cursor-default"
            onClick={onClear}
            disabled={clearDisabled}
          >
            {clearLabel}
          </button>
        )}
      </div>
      <div className="udb-filter-panel__sections flex flex-col gap-4">{children}</div>
    </aside>
  );
}

FilterPanel.displayName = 'FilterPanel';

export interface FilterSectionProps extends BaseProps {
  title: string;
  children: ReactNode;
}

export function FilterSection({ title, children, className }: FilterSectionProps) {
  return (
    <section className={cn('udb-filter-section', className)}>
      <h4 className="udb-filter-section__title text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </h4>
      <div className="udb-filter-section__body flex flex-col gap-2">{children}</div>
    </section>
  );
}

FilterSection.displayName = 'FilterSection';

export interface FilterListOption {
  value: string;
  label: string;
  count?: number;
}

export interface CheckFilterListProps extends BaseProps {
  options: readonly FilterListOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
  maxVisible?: number;
}

export function CheckFilterList({
  options,
  selected,
  onToggle,
  maxVisible = 8,
  className,
}: CheckFilterListProps) {
  const visible = options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;
  const hiddenSelected = options.slice(maxVisible).filter((option) => selected.includes(option.value));
  const shown = hasMore ? [...visible, ...hiddenSelected] : visible;

  return (
    <ul className={cn('udb-check-filter flex flex-col gap-0.5 list-none p-0 m-0', className)} role="group">
      {shown.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <li key={option.value}>
            <button
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              className={cn(
                'udb-check-filter__item w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-left',
                isSelected && 'udb-check-filter__item--checked text-foreground font-medium'
              )}
              onClick={() => onToggle(option.value)}
            >
              <span
                className={cn(
                  'udb-check-filter__box w-4 h-4 rounded border border-border flex items-center justify-center shrink-0 transition-colors',
                  isSelected && 'bg-primary border-primary text-primary-foreground'
                )}
                aria-hidden="true"
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="udb-check-filter__label flex-1 truncate">{option.label}</span>
              {option.count !== undefined && (
                <span className="udb-check-filter__count text-xs text-muted-foreground ml-auto">
                  {option.count}
                </span>
              )}
            </button>
          </li>
        );
      })}
      {hasMore && (
        <li className="udb-check-filter__more text-xs text-muted-foreground px-2 py-1">
          {`+${options.length - shown.length} more`}
        </li>
      )}
    </ul>
  );
}

CheckFilterList.displayName = 'CheckFilterList';

export interface SingleSelectFilterListProps extends BaseProps {
  options: readonly FilterListOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export function SingleSelectFilterList({
  options,
  value,
  onChange,
  className,
}: SingleSelectFilterListProps) {
  return (
    <ul className={cn('udb-check-filter flex flex-col gap-0.5 list-none p-0 m-0', className)} role="group">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <li key={option.value}>
            <button
              type="button"
              role="radio"
              aria-checked={isActive}
              className={cn(
                'udb-check-filter__item w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-left',
                isActive && 'udb-check-filter__item--checked text-foreground font-medium'
              )}
              onClick={() => onChange(isActive ? null : option.value)}
            >
              <span
                className={cn(
                  'udb-check-filter__box udb-check-filter__box--radio w-4 h-4 rounded-full border border-border flex items-center justify-center shrink-0 transition-colors',
                  isActive && 'border-primary'
                )}
                aria-hidden="true"
              >
                {isActive && (
                  <span className="udb-check-filter__radio-dot w-2 h-2 rounded-full bg-primary" />
                )}
              </span>
              <span className="udb-check-filter__label flex-1 truncate">{option.label}</span>
              {option.count !== undefined && (
                <span className="udb-check-filter__count text-xs text-muted-foreground ml-auto">
                  {option.count}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

SingleSelectFilterList.displayName = 'SingleSelectFilterList';
