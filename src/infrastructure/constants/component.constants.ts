/**
 * Component Constants
 * @description Default component configurations
 */

export const DEFAULT_SIZE = 'md' as const;
export const DEFAULT_VARIANT = 'primary' as const;
export const DEFAULT_COLOR_SCHEME = 'light' as const;

export const SIZE_MAP = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

export const COLOR_MAP = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  destructive: 'destructive',
} as const;
