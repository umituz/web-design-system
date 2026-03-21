/**
 * Radius Tokens
 * @description Border radius scale
 */

export type RadiusToken =
  | 'none'
  | 'sm'
  | 'default'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full';

export const radii: Record<RadiusToken, string> = {
  'none': '0',
  'sm': '0.125rem',
  'default': '0.25rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  'full': '9999px',
};
