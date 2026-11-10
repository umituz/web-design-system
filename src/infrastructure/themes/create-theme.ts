import type { ThemeConfig, ThemeColors, ThemeTypography, ThemeRadii } from '../../domain/types';
import { getTheme } from './registry';

export interface ThemeOverrides {
  name?: string;
  mode?: 'light' | 'dark';
  colors?: Partial<ThemeColors>;
  darkColors?: Partial<ThemeColors>;
  typography?: Partial<ThemeTypography>;
  radii?: Partial<ThemeRadii>;
  customVars?: Record<string, string>;
  darkCustomVars?: Record<string, string>;
}

export function createTheme(
  baseOrConfig: string | ThemeConfig,
  overrides?: ThemeOverrides
): ThemeConfig {
  if (typeof baseOrConfig === 'object' && !overrides) {
    return baseOrConfig;
  }

  const base = typeof baseOrConfig === 'string' ? getTheme(baseOrConfig) : baseOrConfig;
  if (!overrides) return base;

  return {
    name: overrides.name ?? base.name,
    mode: overrides.mode ?? base.mode,
    colors: {
      ...base.colors,
      ...(overrides.colors ?? {}),
    },
    darkColors: {
      ...(base.darkColors ?? {}),
      ...(overrides.darkColors ?? {}),
    },
    typography: {
      ...(base.typography ?? {}),
      ...(overrides.typography ?? {}),
    },
    radii: {
      ...(base.radii ?? {}),
      ...(overrides.radii ?? {}),
    },
    customVars: {
      ...(base.customVars ?? {}),
      ...(overrides.customVars ?? {}),
    },
    darkCustomVars: {
      ...(base.darkCustomVars ?? {}),
      ...(overrides.darkCustomVars ?? {}),
    },
  };
}
