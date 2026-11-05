
export const TEXT_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
} as const;

export type TextSizeKey = keyof typeof TEXT_SIZES;

export type TextSize = typeof TEXT_SIZES[TextSizeKey];

export const FONT_WEIGHTS = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
} as const;

export type FontWeightKey = keyof typeof FONT_WEIGHTS;

export type FontWeight = typeof FONT_WEIGHTS[FontWeightKey];

export const COMMON_TEXT_SIZES = {
  caption: TEXT_SIZES.xs,
  small: TEXT_SIZES.sm,
  body: TEXT_SIZES.base,
  subtitle: TEXT_SIZES.lg,
  title: TEXT_SIZES.xl,
  heading: TEXT_SIZES['2xl'],
  display: TEXT_SIZES['4xl'],
} as const;

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
