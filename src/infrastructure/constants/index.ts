/**
 * Infrastructure Constants
 * @description Constant exports
 * Subpath: @umituz/web-design-system/constants
 */

export {
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  DEFAULT_COLOR_SCHEME,
  SIZE_MAP,
  COLOR_MAP,
} from './component.constants';

export {
  BREAKPOINTS,
  createMediaQuery,
  createMaxMediaQuery,
  BREAKPOINT_ORDER,
  compareBreakpoints,
  isBreakpointGreaterThan,
  isBreakpointLessThan,
} from './breakpoint.constants';

export {
  SPACING_SCALE,
  COMMON_SPACING,
  SIZE_SPACING,
  type SpacingScaleKey,
  type SpacingScale,
  isValidSpacing,
} from './spacing.constants';

export {
  SIZE_VARIANTS,
  SIZE_VARIANT_ORDER,
  getNextSizeVariant,
  getPrevSizeVariant,
  type SizeVariantKey,
  type SizeVariant,
  type SmallSizes,
  type MediumSizes,
  type RegularSizes,
  type ExtendedSizes,
  type AllSizes,
  isValidSizeVariant,
} from './size-variant.constants';

export {
  TEXT_SIZES,
  FONT_WEIGHTS,
  COMMON_TEXT_SIZES,
  TEXT_SIZE_BY_VARIANT,
  type TextSizeKey,
  type TextSize,
  type FontWeightKey,
  type FontWeight,
} from './typography.constants';
