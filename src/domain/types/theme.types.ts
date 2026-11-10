export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  destructive: string;
  destructiveForeground: string;
  ring?: string;
  success?: string;
  successForeground?: string;
  warning?: string;
  warningForeground?: string;
  info?: string;
  infoForeground?: string;
  violet?: string;
  violetForeground?: string;
  primarySoft?: string;
}

export interface ThemeTypography {
  fontSans?: string;
  fontMono?: string;
  fontDisplay?: string;
}

export interface ThemeRadii {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}

export interface ThemeConfig {
  name: string;
  mode?: 'light' | 'dark';
  colors: ThemeColors;
  darkColors?: Partial<ThemeColors>;
  typography?: ThemeTypography;
  radii?: ThemeRadii;
  customVars?: Record<string, string>;
  darkCustomVars?: Record<string, string>;
}
