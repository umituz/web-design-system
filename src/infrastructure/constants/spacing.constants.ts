/**
 * Spacing Constants
 * @description Tailwind CSS spacing scale values
 * @see https://tailwindcss.com/docs/customizing-spacing
 *
 * All spacing values used in the design system are defined here.
 * This provides a single source of truth for spacing scale.
 */

/**
 * Tailwind CSS spacing scale
 * Each value represents a spacing unit that maps to a specific pixel value
 * Format: Key is the spacing class name, value is the unit number (as string for Tailwind class construction)
 */
export const SPACING_SCALE = {
  '0': '0',   // 0px
  '0.5': '0.5', // 2px
  '1': '1',   // 4px
  '1.5': '1.5', // 6px
  '2': '2',   // 8px
  '2.5': '2.5', // 10px
  '3': '3',   // 12px
  '3.5': '3.5', // 14px
  '4': '4',   // 16px
  '5': '5',   // 20px
  '6': '6',   // 24px
  '7': '7',   // 28px
  '8': '8',   // 32px
  '9': '9',   // 36px
  '10': '10', // 40px
  '11': '11', // 44px
  '12': '12', // 48px
  '14': '14', // 56px
  '16': '16', // 64px
  '20': '20', // 80px
  '24': '24', // 96px
  '28': '28', // 112px
  '32': '32', // 128px
  '36': '36', // 144px
  '40': '40', // 160px
  '44': '44', // 176px
  '48': '48', // 192px
  '52': '52', // 208px
  '56': '56', // 224px
  '60': '60', // 240px
  '64': '64', // 256px
  '72': '72', // 288px
  '80': '80', // 320px
  '96': '96', // 384px
} as const;

/**
 * Type for spacing scale keys
 */
export type SpacingScaleKey = keyof typeof SPACING_SCALE;

/**
 * Type for spacing scale values (string format for Tailwind classes)
 */
export type SpacingScale = `${SpacingScaleKey}`;

/**
 * Common spacing values used throughout the design system
 * These are frequently used spacing values
 */
export const COMMON_SPACING = {
  xs: SPACING_SCALE['1'],
  sm: SPACING_SCALE['2'],
  md: SPACING_SCALE['4'],
  lg: SPACING_SCALE['6'],
  xl: SPACING_SCALE['8'],
  '2xl': SPACING_SCALE['12'],
} as const;

/**
 * Spacing scale for component sizing
 */
export const SIZE_SPACING = {
  xs: SPACING_SCALE['3'],
  sm: SPACING_SCALE['4'],
  md: SPACING_SCALE['5'],
  lg: SPACING_SCALE['6'],
  xl: SPACING_SCALE['8'],
  '2xl': SPACING_SCALE['10'],
} as const;

/**
 * Validate if a value is a valid spacing scale
 */
export function isValidSpacing(value: string): value is SpacingScale {
  return Object.keys(SPACING_SCALE).includes(value);
}
