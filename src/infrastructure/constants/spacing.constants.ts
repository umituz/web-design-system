
export const SPACING_SCALE = {
  '0': '0',
  '0.5': '0.5',
  '1': '1',
  '1.5': '1.5',
  '2': '2',
  '2.5': '2.5',
  '3': '3',
  '3.5': '3.5',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  '11': '11',
  '12': '12',
  '14': '14',
  '16': '16',
  '20': '20',
  '24': '24',
  '28': '28',
  '32': '32',
  '36': '36',
  '40': '40',
  '44': '44',
  '48': '48',
  '52': '52',
  '56': '56',
  '60': '60',
  '64': '64',
  '72': '72',
  '80': '80',
  '96': '96',
} as const;

export type SpacingScaleKey = keyof typeof SPACING_SCALE;

export type SpacingScale = `${SpacingScaleKey}`;

export const COMMON_SPACING = {
  xs: SPACING_SCALE['1'],
  sm: SPACING_SCALE['2'],
  md: SPACING_SCALE['4'],
  lg: SPACING_SCALE['6'],
  xl: SPACING_SCALE['8'],
  '2xl': SPACING_SCALE['12'],
} as const;

export const SIZE_SPACING = {
  xs: SPACING_SCALE['3'],
  sm: SPACING_SCALE['4'],
  md: SPACING_SCALE['5'],
  lg: SPACING_SCALE['6'],
  xl: SPACING_SCALE['8'],
  '2xl': SPACING_SCALE['10'],
} as const;

export function isValidSpacing(value: string): value is SpacingScale {
  return Object.keys(SPACING_SCALE).includes(value);
}
