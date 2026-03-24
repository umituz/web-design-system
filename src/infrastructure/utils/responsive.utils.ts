/**
 * Responsive Utility Functions
 * @description Centralized functions for building responsive Tailwind classes
 * All responsive class construction logic lives here - components should only call these functions
 */

import { cn } from './cn.util';
import type { SizeVariant, Breakpoint } from '../../domain/types';
import {
  RESPONSIVE_SPACING,
  RESPONSIVE_ICON_SIZE,
  RESPONSIVE_CONTAINER_SIZE,
  RESPONSIVE_TEXT_SIZE,
} from '../../domain/tokens/responsive-map.tokens';

/**
 * Build responsive padding/margin/gap classes
 * @param property - Tailwind spacing property ('p', 'm', 'px', 'py', 'gap', 'space-y', 'space-x')
 * @param size - Size variant (sm, md, lg, xl)
 * @returns Complete responsive class string
 *
 * @example
 * getSpacing('p', 'md') // "p-4 sm:p-5 md:p-5 lg:p-6 xl:p-8 2xl:p-10"
 */
export function getSpacing(
  property: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'gap' | 'space-y' | 'space-x',
  size: SizeVariant
): string {
  const token = RESPONSIVE_SPACING[size];

  // Start with base (xs/mobile) value
  const classes: string[] = [`${property}-${token.xs}`];

  // Add breakpoint-specific classes
  const breakpoints: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
  breakpoints.forEach((bp) => {
    if (token[bp] !== token.xs) {
      classes.push(`${bp}:${property}-${token[bp]}`);
    }
  });

  return classes.join(' ');
}

/**
 * Build responsive icon size classes (height + width)
 * @param size - Size variant
 * @returns Combined height and width classes
 *
 * @example
 * getIconSize('md') // "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 xl:h-9 xl:w-9 2xl:h-10 2xl:w-10"
 */
export function getIconSize(size: SizeVariant): string {
  const token = RESPONSIVE_ICON_SIZE[size];
  const classes: string[] = [`h-${token.xs}`, `w-${token.xs}`];

  const breakpoints: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
  breakpoints.forEach((bp) => {
    if (token[bp] !== token.xs) {
      classes.push(`${bp}:h-${token[bp]}`, `${bp}:w-${token[bp]}`);
    }
  });

  return classes.join(' ');
}

/**
 * Build responsive container size classes (for icon wrappers)
 * @param size - Size variant
 * @returns Combined height, width, and flex center classes
 *
 * @example
 * getContainerSize('md') // "w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12..."
 */
export function getContainerSize(size: SizeVariant): string {
  const token = RESPONSIVE_CONTAINER_SIZE[size];
  const classes: string[] = [`w-${token.xs}`, `h-${token.xs}`];

  const breakpoints: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
  breakpoints.forEach((bp) => {
    if (token[bp] !== token.xs) {
      classes.push(`${bp}:w-${token[bp]}`, `${bp}:h-${token[bp]}`);
    }
  });

  return classes.join(' ');
}

/**
 * Get responsive text size classes
 * @param size - Size variant
 * @returns Text size class string
 *
 * @example
 * getTextSize('md') // "text-sm sm:text-base"
 */
export function getTextSize(size: SizeVariant): string {
  const token = RESPONSIVE_TEXT_SIZE[size];
  return cn(token.mobile, token.tablet);
}

/**
 * Build responsive gap/spacing classes for layout
 * @param size - Size variant
 * @returns Gap class string
 *
 * @example
 * getGap('md') // "gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-5 2xl:gap-6"
 */
export function getGap(size: SizeVariant): string {
  return getSpacing('gap', size);
}

/**
 * Build responsive space-y classes for vertical stacking
 * @param size - Size variant
 * @returns Space-y class string
 *
 * @example
 * getSpaceY('md') // "space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-5..."
 */
export function getSpaceY(size: SizeVariant): string {
  return getSpacing('space-y', size);
}

/**
 * Get complete responsive styles for common component patterns
 * @param size - Size variant
 * @param options - Which styles to include
 * @returns Combined class string
 *
 * @example
 * getResponsiveStyles('md', { padding: true, gap: true })
 * // "p-4 sm:p-5 md:p-5 lg:p-6 xl:p-8 2xl:p-10 gap-3 sm:gap-4..."
 */
export function getResponsiveStyles(
  size: SizeVariant,
  options: {
    padding?: boolean;
    gap?: boolean;
    iconSize?: boolean;
    textSize?: boolean;
    containerSize?: boolean;
  } = {}
): string {
  const classes: string[] = [];

  if (options.padding) {
    classes.push(getSpacing('p', size));
  }
  if (options.gap) {
    classes.push(getGap(size));
  }
  if (options.iconSize) {
    classes.push(getIconSize(size));
  }
  if (options.textSize) {
    classes.push(getTextSize(size));
  }
  if (options.containerSize) {
    classes.push(getContainerSize(size));
  }

  return classes.join(' ');
}
