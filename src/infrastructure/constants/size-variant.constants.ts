/**
 * Size Variant Constants
 * @description Size variants used throughout the design system
 *
 * All size variant values are defined here to provide consistency
 * and prevent hardcoded strings in components.
 */

/**
 * Size variants available in the design system
 * Ordered from smallest to largest
 */
export const SIZE_VARIANTS = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
} as const;

/**
 * Type for size variant keys
 */
export type SizeVariantKey = keyof typeof SIZE_VARIANTS;

/**
 * Type for size variant values
 */
export type SizeVariant = typeof SIZE_VARIANTS[SizeVariantKey];

/**
 * Common size combinations used by components
 * These prevent repeating Extract<SizeVariant, '...'> in every component
 */
export type SmallSizes = Extract<SizeVariant, 'xs' | 'sm'>;
export type MediumSizes = Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
export type RegularSizes = Extract<SizeVariant, 'sm' | 'md' | 'lg' | 'xl'>;
export type ExtendedSizes = Extract<SizeVariant, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>;
export type AllSizes = SizeVariant;

/**
 * Size variant order (for sorting/comparison)
 */
export const SIZE_VARIANT_ORDER: SizeVariant[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Get the next larger size variant
 */
export function getNextSizeVariant(current: SizeVariant): SizeVariant | null {
  const index = SIZE_VARIANT_ORDER.indexOf(current);
  if (index === -1 || index === SIZE_VARIANT_ORDER.length - 1) {
    return null;
  }
  return SIZE_VARIANT_ORDER[index + 1];
}

/**
 * Get the next smaller size variant
 */
export function getPrevSizeVariant(current: SizeVariant): SizeVariant | null {
  const index = SIZE_VARIANT_ORDER.indexOf(current);
  if (index <= 0) {
    return null;
  }
  return SIZE_VARIANT_ORDER[index - 1];
}

/**
 * Validate if a value is a valid size variant
 */
export function isValidSizeVariant(value: string): value is SizeVariant {
  return Object.values(SIZE_VARIANTS).includes(value as SizeVariant);
}
