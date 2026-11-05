
import type { SizeVariant, Breakpoint } from '../types';
import { SPACING_SCALE } from '../../infrastructure/constants/spacing.constants';
import { TEXT_SIZES, type TextSizeKey } from '../../infrastructure/constants/typography.constants';
import { BREAKPOINT_ORDER } from '../../infrastructure/constants/breakpoint.constants';

type ScaleFormula = (base: number, breakpoint: Breakpoint) => number;

type ResponsiveScale = Record<SizeVariant, Partial<Record<Breakpoint, string>>>;


const SPACING_BASES: Record<SizeVariant, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
};

const ICON_BASES: Record<SizeVariant, number> = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 8,
  xl: 10,
  '2xl': 12,
};

const CONTAINER_BASES: Record<SizeVariant, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
};

const GAP_BASES: Record<SizeVariant, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
};


const spacingFormula: ScaleFormula = (base, bp) => {
  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  if (bpIndex <= 1) return base;
  if (bpIndex <= 3) return base + 1;
  if (bpIndex === 4) return base + 2;
  return base + 3;
};

const iconFormula: ScaleFormula = (base, bp) => {
  if (bp === 'xs') return base - 1;
  if (bp === 'sm') return base;
  if (bp === 'md') return base + 1;
  if (bp === 'lg') return base + 2;
  if (bp === 'xl') return base + 3;
  return base + 3;
};

const containerFormula: ScaleFormula = (base, bp) => {
  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  if (bpIndex <= 3) return base + 2;
  if (bpIndex === 4) return base + 2;
  return base + 2;
};

const gapFormula: ScaleFormula = (base, bp) => {
  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  if (bpIndex <= 1) return base;
  if (bpIndex <= 3) return base + 1;
  if (bpIndex === 4) return base + 1;
  return base + 2;
};


function generateResponsiveScale(
  bases: Record<SizeVariant, number>,
  formula: ScaleFormula
): ResponsiveScale {
  const result: Partial<ResponsiveScale> = {};

  for (const size of Object.keys(bases) as SizeVariant[]) {
    const base = bases[size];
    result[size] = {};

    for (const bp of BREAKPOINT_ORDER) {
      const scaleIndex = formula(base, bp);
      const scaleKey = scaleIndex.toString() as keyof typeof SPACING_SCALE;

      if (scaleKey in SPACING_SCALE) {
        result[size]![bp] = SPACING_SCALE[scaleKey];
      }
    }
  }

  return result as ResponsiveScale;
}

function generateResponsiveTextSizes() {
  const textSizeKeys: Record<SizeVariant, { mobile: TextSizeKey; tablet: TextSizeKey }> = {
    xs: { mobile: 'xs', tablet: 'xs' },
    sm: { mobile: 'xs', tablet: 'sm' },
    md: { mobile: 'sm', tablet: 'base' },
    lg: { mobile: 'base', tablet: 'lg' },
    xl: { mobile: 'lg', tablet: 'xl' },
    '2xl': { mobile: 'xl', tablet: '2xl' },
  };

  const result: Partial<Record<SizeVariant, Partial<Record<'mobile' | 'tablet', string>>>> = {};

  for (const size of Object.keys(textSizeKeys) as SizeVariant[]) {
    const keys = textSizeKeys[size];
    result[size] = {
      mobile: TEXT_SIZES[keys.mobile],
      tablet: `sm:${TEXT_SIZES[keys.tablet]}`,
    };
  }

  return result as Record<SizeVariant, Partial<Record<'mobile' | 'tablet', string>>>;
}


export const RESPONSIVE_SPACING = generateResponsiveScale(SPACING_BASES, spacingFormula);

export const RESPONSIVE_ICON_SIZE = generateResponsiveScale(ICON_BASES, iconFormula);

export const RESPONSIVE_CONTAINER_SIZE = generateResponsiveScale(CONTAINER_BASES, containerFormula);

export const RESPONSIVE_GAP = generateResponsiveScale(GAP_BASES, gapFormula);

export const RESPONSIVE_TEXT_SIZE = generateResponsiveTextSizes();

export type SpacingScale = keyof typeof SPACING_SCALE;
