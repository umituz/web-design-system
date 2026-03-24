/**
 * Typography Constants
 * @description Typography scale values for the design system
 *
 * All font size and text utility values are defined here.
 * This provides consistency with Tailwind's default typography scale.
 */

/**
 * Text size utilities (Tailwind text classes)
 */
export const TEXT_SIZES = {
  xs: 'text-xs',       // 0.75rem (12px)
  sm: 'text-sm',       // 0.875rem (14px)
  base: 'text-base',   // 1rem (16px)
  lg: 'text-lg',       // 1.125rem (18px)
  xl: 'text-xl',       // 1.25rem (20px)
  '2xl': 'text-2xl',   // 1.5rem (24px)
  '3xl': 'text-3xl',   // 1.875rem (30px)
  '4xl': 'text-4xl',   // 2.25rem (36px)
  '5xl': 'text-5xl',   // 3rem (48px)
  '6xl': 'text-6xl',   // 3.75rem (60px)
  '7xl': 'text-7xl',   // 4.5rem (72px)
  '8xl': 'text-8xl',   // 6rem (96px)
  '9xl': 'text-9xl',   // 8rem (128px)
} as const;

/**
 * Type for text size keys
 */
export type TextSizeKey = keyof typeof TEXT_SIZES;

/**
 * Type for text size values
 */
export type TextSize = typeof TEXT_SIZES[TextSizeKey];

/**
 * Font weight utilities
 */
export const FONT_WEIGHTS = {
  thin: 'font-thin',       // 100
  extralight: 'font-extralight', // 200
  light: 'font-light',     // 300
  normal: 'font-normal',   // 400
  medium: 'font-medium',   // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',       // 700
  extrabold: 'font-extrabold', // 800
  black: 'font-black',     // 900
} as const;

/**
 * Type for font weight keys
 */
export type FontWeightKey = keyof typeof FONT_WEIGHTS;

/**
 * Type for font weight values
 */
export type FontWeight = typeof FONT_WEIGHTS[FontWeightKey];

/**
 * Common text sizes for different element types
 */
export const COMMON_TEXT_SIZES = {
  caption: TEXT_SIZES.xs,
  small: TEXT_SIZES.sm,
  body: TEXT_SIZES.base,
  subtitle: TEXT_SIZES.lg,
  title: TEXT_SIZES.xl,
  heading: TEXT_SIZES['2xl'],
  display: TEXT_SIZES['4xl'],
} as const;

/**
 * Text sizes by size variant
 * Maps size variants to appropriate text sizes
 */
export const TEXT_SIZE_BY_VARIANT = {
  xs: {
    mobile: TEXT_SIZES.xs,
    tablet: TEXT_SIZES.xs,
  },
  sm: {
    mobile: TEXT_SIZES.xs,
    tablet: TEXT_SIZES.sm,
  },
  md: {
    mobile: TEXT_SIZES.sm,
    tablet: TEXT_SIZES.base,
  },
  lg: {
    mobile: TEXT_SIZES.base,
    tablet: TEXT_SIZES.lg,
  },
  xl: {
    mobile: TEXT_SIZES.lg,
    tablet: TEXT_SIZES.xl,
  },
} as const;
