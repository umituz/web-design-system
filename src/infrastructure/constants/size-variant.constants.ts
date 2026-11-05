
export const SIZE_VARIANTS = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
} as const;

export type SizeVariantKey = keyof typeof SIZE_VARIANTS;

export type SizeVariant = typeof SIZE_VARIANTS[SizeVariantKey];

export type SmallSizes = Extract<SizeVariant, 'xs' | 'sm'>;
export type MediumSizes = Extract<SizeVariant, 'sm' | 'md' | 'lg'>;
export type RegularSizes = Extract<SizeVariant, 'sm' | 'md' | 'lg' | 'xl'>;
export type ExtendedSizes = Extract<SizeVariant, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>;
export type AllSizes = SizeVariant;

export const SIZE_VARIANT_ORDER: SizeVariant[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export function getNextSizeVariant(current: SizeVariant): SizeVariant | null {
  const index = SIZE_VARIANT_ORDER.indexOf(current);
  if (index === -1 || index === SIZE_VARIANT_ORDER.length - 1) {
    return null;
  }
  return SIZE_VARIANT_ORDER[index + 1] ?? null;
}

export function getPrevSizeVariant(current: SizeVariant): SizeVariant | null {
  const index = SIZE_VARIANT_ORDER.indexOf(current);
  if (index <= 0) {
    return null;
  }
  return SIZE_VARIANT_ORDER[index - 1] ?? null;
}

export function isValidSizeVariant(value: string): value is SizeVariant {
  return Object.values(SIZE_VARIANTS).includes(value as SizeVariant);
}
