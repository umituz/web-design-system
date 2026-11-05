
import { cn } from './cn.util';
import type { SizeVariant, Breakpoint } from '../../domain/types';
import {
  RESPONSIVE_SPACING,
  RESPONSIVE_ICON_SIZE,
  RESPONSIVE_CONTAINER_SIZE,
  RESPONSIVE_TEXT_SIZE,
} from '../../domain/tokens/responsive-map.tokens';

export function getSpacing(
  property: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'gap' | 'space-y' | 'space-x',
  size: SizeVariant
): string {
  const token = RESPONSIVE_SPACING[size];

  const classes: string[] = [`${property}-${token.xs}`];

  const breakpoints: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
  breakpoints.forEach((bp) => {
    if (token[bp] !== token.xs) {
      classes.push(`${bp}:${property}-${token[bp]}`);
    }
  });

  return classes.join(' ');
}

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

export function getTextSize(size: SizeVariant): string {
  const token = RESPONSIVE_TEXT_SIZE[size];
  return cn(token.mobile, token.tablet);
}

export function getGap(size: SizeVariant): string {
  return getSpacing('gap', size);
}

export function getSpaceY(size: SizeVariant): string {
  return getSpacing('space-y', size);
}

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
