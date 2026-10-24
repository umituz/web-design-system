/**
 * BookmarkButton Component (Molecule)
 * @description Accessible toggleable button for saving, bookmarking, or favoriting items.
 * Supports pill (icon + label) and icon-only variants, multiple sizes, semantic tones, and custom icons.
 */

import React, { forwardRef } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { Spinner } from '../atoms/Spinner';
import type { BaseProps } from '../../domain/types';

export type BookmarkTone = 'warning' | 'primary' | 'success' | 'default';

export interface BookmarkButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange' | 'onToggle'>,
    BaseProps {
  /** Whether the item is currently saved / bookmarked / active. */
  active?: boolean;
  /** Callback fired when clicked or toggled. Passes the inverted active state. */
  onToggle?: (nextActive: boolean) => void;
  /** Display variant: 'pill' shows icon + label, 'icon' renders a square/round icon-only button. */
  variant?: 'pill' | 'icon';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Inactive label (default: "Save"). Used as text in pill mode and aria-label in icon mode. */
  label?: string;
  /** Active label (default: "Saved"). */
  activeLabel?: string;
  /** Custom icon when inactive. Defaults to a Star outline. */
  icon?: React.ReactNode;
  /** Custom icon when active. Defaults to a filled Star. */
  activeIcon?: React.ReactNode;
  /** Color theme tone when active (default: 'warning' for warm bookmark gold). */
  tone?: BookmarkTone;
  /** Loading indicator */
  loading?: boolean;
}

const pillSizeStyles = {
  xs: 'h-7 px-2 text-xs gap-1.5 [&_svg]:size-3.5',
  sm: 'h-8 px-2.5 text-xs font-semibold gap-1.5 [&_svg]:size-3.5',
  md: 'h-9 px-3.5 text-sm font-semibold gap-2 [&_svg]:size-4',
  lg: 'h-10 px-4 text-base font-semibold gap-2.5 [&_svg]:size-5',
};

const iconSizeStyles = {
  xs: 'h-7 w-7 [&_svg]:size-3.5',
  sm: 'h-8 w-8 [&_svg]:size-4',
  md: 'h-9 w-9 [&_svg]:size-4',
  lg: 'h-10 w-10 [&_svg]:size-5',
};

const pillToneActiveStyles: Record<BookmarkTone, string> = {
  warning: 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15',
  primary: 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/15',
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15',
  default: 'border-border bg-accent text-accent-foreground hover:bg-accent/80',
};

const iconToneActiveStyles: Record<BookmarkTone, string> = {
  warning: 'text-amber-500 hover:text-amber-600 bg-amber-500/10',
  primary: 'text-primary hover:text-primary/90 bg-primary/10',
  success: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-500/10',
  default: 'text-foreground bg-accent',
};

export const BookmarkButton = forwardRef<HTMLButtonElement, BookmarkButtonProps>(
  (
    {
      active = false,
      onToggle,
      onClick,
      variant = 'pill',
      size = 'sm',
      label = 'Save',
      activeLabel,
      icon,
      activeIcon,
      tone = 'warning',
      loading = false,
      disabled,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const resolvedActiveLabel = activeLabel ?? (label === 'Save' ? 'Saved' : label);
    const currentLabel = active ? resolvedActiveLabel : label;

    const defaultActiveIcon = activeIcon ?? (icon ? icon : <Star className="fill-current" />);
    const defaultInactiveIcon = icon ?? <Star />;
    const renderedIcon = active ? defaultActiveIcon : defaultInactiveIcon;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      onToggle?.(!active);
      onClick?.(e);
    };

    if (variant === 'icon') {
      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          aria-pressed={active}
          aria-label={currentLabel}
          title={currentLabel}
          onClick={handleClick}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-md border border-transparent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
            iconSizeStyles[size],
            active
              ? iconToneActiveStyles[tone]
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            className
          )}
          {...props}
        >
          {loading ? <Spinner size="sm" /> : renderedIcon}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-pressed={active}
        aria-label={currentLabel}
        title={currentLabel}
        onClick={handleClick}
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-md border font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          pillSizeStyles[size],
          active
            ? pillToneActiveStyles[tone]
            : 'border-input bg-background text-foreground/80 hover:bg-accent hover:text-accent-foreground',
          className
        )}
        {...props}
      >
        {loading ? <Spinner size="sm" /> : renderedIcon}
        <span>{currentLabel}</span>
      </button>
    );
  }
);

BookmarkButton.displayName = 'BookmarkButton';
