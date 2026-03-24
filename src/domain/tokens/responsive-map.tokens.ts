/**
 * Responsive Design Tokens (Formula-Based)
 * @description Centralized responsive scale generation using formulas
 *
 * All responsive values are generated dynamically from base values and formulas.
 * This provides ZERO code duplication and single source of truth.
 *
 * To modify responsive behavior:
 * 1. Change base values (BASE_* constants)
 * 2. Modify formula functions (*Formula)
 * 3. Entire system updates automatically
 */

import type { SizeVariant, Breakpoint } from '../types';
import { SPACING_SCALE } from '../../infrastructure/constants/spacing.constants';
import { TEXT_SIZES, type TextSizeKey } from '../../infrastructure/constants/typography.constants';
import { BREAKPOINT_ORDER } from '../../infrastructure/constants/breakpoint.constants';

/**
 * Type for scale generation formula
 * Input: base value for size variant, current breakpoint
 * Output: spacing scale index (as number, will be converted to string)
 */
type ScaleFormula = (base: number, breakpoint: Breakpoint) => number;

/**
 * Type for generator result
 */
type ResponsiveScale = Record<SizeVariant, Partial<Record<Breakpoint, string>>>;

// ============================================================================
// BASE VALUES - Single source of truth for size variants
// ============================================================================

/**
 * Base spacing values for each size variant
 * Defines the starting point for responsive spacing calculation
 */
const SPACING_BASES: Record<SizeVariant, number> = {
  xs: 1, // SPACING_SCALE['1'] = 4px
  sm: 2, // SPACING_SCALE['2'] = 8px
  md: 3, // SPACING_SCALE['3'] = 12px
  lg: 4, // SPACING_SCALE['4'] = 16px
  xl: 5, // SPACING_SCALE['5'] = 20px
  '2xl': 6, // SPACING_SCALE['6'] = 24px
};

/**
 * Base icon size values for each size variant
 */
const ICON_BASES: Record<SizeVariant, number> = {
  xs: 4,
  sm: 5,
  md: 6,
  lg: 8,
  xl: 10,
  '2xl': 12,
};

/**
 * Base container size values (for icon wrappers)
 */
const CONTAINER_BASES: Record<SizeVariant, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
};

/**
 * Base gap/spacing values for layout
 */
const GAP_BASES: Record<SizeVariant, number> = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
};

// ============================================================================
// FORMULAS - Define responsive behavior for each token type
// ============================================================================

/**
 * Spacing formula for padding, margin, gap
 * Progression: xs/sm→base, md/lg→base+1, xl→base+2, 2xl→base+3
 */
const spacingFormula: ScaleFormula = (base, bp) => {
  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  if (bpIndex <= 1) return base; // xs, sm
  if (bpIndex <= 3) return base + 1; // md, lg
  if (bpIndex === 4) return base + 2; // xl
  return base + 3; // 2xl
};

/**
 * Icon size formula
 * Progression: More gradual increase across breakpoints
 */
const iconFormula: ScaleFormula = (base, bp) => {
  if (bp === 'xs') return base - 1;
  if (bp === 'sm') return base;
  if (bp === 'md') return base + 1;
  if (bp === 'lg') return base + 2;
  if (bp === 'xl') return base + 3;
  return base + 3; // 2xl
};

/**
 * Container size formula (for icon wrappers)
 * Consistent size increase
 */
const containerFormula: ScaleFormula = (base, bp) => {
  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  if (bpIndex <= 3) return base + 2; // xs, sm, md, lg
  if (bpIndex === 4) return base + 2; // xl
  return base + 2; // 2xl
};

/**
 * Gap formula for layout spacing
 */
const gapFormula: ScaleFormula = (base, bp) => {
  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  if (bpIndex <= 1) return base; // xs, sm
  if (bpIndex <= 3) return base + 1; // md, lg
  if (bpIndex === 4) return base + 1; // xl
  return base + 2; // 2xl
};

// ============================================================================
// GENERATORS - Create responsive scales dynamically
// ============================================================================

/**
 * Generate responsive scale for any token type
 * @param bases - Base values for each size variant
 * @param formula - Formula to calculate value at each breakpoint
 * @returns Complete responsive scale object
 */
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

      // Validate and get spacing scale value
      if (scaleKey in SPACING_SCALE) {
        result[size]![bp] = SPACING_SCALE[scaleKey];
      }
    }
  }

  return result as ResponsiveScale;
}

/**
 * Generate responsive text sizes
 * Text sizes use string literals, not spacing scale
 */
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

// ============================================================================
// EXPORTS - All responsive tokens (one line each!)
// ============================================================================

/**
 * Responsive spacing scale for padding, margin, space-*, gap-*
 */
export const RESPONSIVE_SPACING = generateResponsiveScale(SPACING_BASES, spacingFormula);

/**
 * Responsive icon sizes (height/width)
 */
export const RESPONSIVE_ICON_SIZE = generateResponsiveScale(ICON_BASES, iconFormula);

/**
 * Responsive container sizes for icon wrappers
 */
export const RESPONSIVE_CONTAINER_SIZE = generateResponsiveScale(CONTAINER_BASES, containerFormula);

/**
 * Responsive gap/spacing for layouts
 */
export const RESPONSIVE_GAP = generateResponsiveScale(GAP_BASES, gapFormula);

/**
 * Responsive text sizes (mobile + tablet)
 */
export const RESPONSIVE_TEXT_SIZE = generateResponsiveTextSizes();

/**
 * Type exports
 */
export type SpacingScale = keyof typeof SPACING_SCALE;
