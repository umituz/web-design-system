/**
 * Chip Component (Molecule)
 * @description Selectable/removable tag
 */

import { forwardRef } from 'react';
import { cn } from '../../infrastructure/utils';
import type { BaseProps, ColorVariant } from '../../domain/types';
import { Badge } from '../atoms/Badge';
import { Icon } from '../atoms/Icon';

export interface ChipProps extends BaseProps {
  label: string;
  variant?: ColorVariant;
  onRemove?: () => void;
  onClick?: () => void;
  removable?: boolean;
  /** Toggle state for filter chips — renders as a pressed button when set. */
  selected?: boolean;
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ label, variant = 'secondary', onRemove, onClick, removable = true, selected, className, ...props }, ref) => {
    const isFilter = selected !== undefined;
    const resolvedVariant = selected ? 'primary' : variant;
    return (
      <Badge
        ref={ref}
        variant={resolvedVariant}
        role={isFilter && onClick ? 'button' : undefined}
        aria-pressed={isFilter ? selected : undefined}
        className={cn(
          'gap-1.5 pr-2',
          onClick && 'cursor-pointer hover:opacity-80',
          isFilter && !selected && 'hover:border-primary/40',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <span>{label}</span>
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="hover:opacity-70"
          >
            <Icon size="xs">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </Icon>
          </button>
        )}
      </Badge>
    );
  }
);

Chip.displayName = 'Chip';
