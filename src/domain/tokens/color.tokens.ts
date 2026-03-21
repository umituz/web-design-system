/**
 * Color Tokens
 * @description Design system color tokens
 */

export interface ColorTokens {
  // Primary
  primary: string;
  primaryForeground: string;

  // Secondary
  secondary: string;
  secondaryForeground: string;

  // Background
  background: string;
  foreground: string;

  // Surfaces
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  // Interactive
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;

  // Status
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;

  // Borders
  border: string;
  input: string;
  ring: string;
}

export const lightColorTokens: ColorTokens = {
  primary: 'hsl(187 75% 38%)',
  primaryForeground: 'hsl(0 0% 100%)',
  secondary: 'hsl(215 20% 92%)',
  secondaryForeground: 'hsl(220 20% 12%)',
  background: 'hsl(210 20% 98%)',
  foreground: 'hsl(220 20% 12%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(220 20% 12%)',
  popover: 'hsl(0 0% 100%)',
  popoverForeground: 'hsl(220 20% 12%)',
  muted: 'hsl(220 15% 94%)',
  mutedForeground: 'hsl(215 15% 45%)',
  accent: 'hsl(187 75% 38%)',
  accentForeground: 'hsl(0 0% 100%)',
  destructive: 'hsl(0 72% 51%)',
  destructiveForeground: 'hsl(0 0% 100%)',
  success: 'hsl(152 55% 40%)',
  successForeground: 'hsl(0 0% 100%)',
  warning: 'hsl(38 90% 48%)',
  warningForeground: 'hsl(0 0% 100%)',
  border: 'hsl(220 15% 88%)',
  input: 'hsl(220 15% 88%)',
  ring: 'hsl(187 75% 38%)',
};

export const darkColorTokens: ColorTokens = {
  primary: 'hsl(187 85% 53%)',
  primaryForeground: 'hsl(220 20% 7%)',
  secondary: 'hsl(215 20% 20%)',
  secondaryForeground: 'hsl(210 20% 98%)',
  background: 'hsl(220 20% 7%)',
  foreground: 'hsl(210 20% 92%)',
  card: 'hsl(220 18% 11%)',
  cardForeground: 'hsl(210 20% 92%)',
  popover: 'hsl(220 18% 13%)',
  popoverForeground: 'hsl(210 20% 92%)',
  muted: 'hsl(220 15% 16%)',
  mutedForeground: 'hsl(215 15% 55%)',
  accent: 'hsl(187 85% 53%)',
  accentForeground: 'hsl(220 20% 7%)',
  destructive: 'hsl(0 72% 55%)',
  destructiveForeground: 'hsl(0 0% 100%)',
  success: 'hsl(152 60% 48%)',
  successForeground: 'hsl(0 0% 100%)',
  warning: 'hsl(38 92% 55%)',
  warningForeground: 'hsl(220 20% 7%)',
  border: 'hsl(220 15% 18%)',
  input: 'hsl(220 15% 18%)',
  ring: 'hsl(187 85% 53%)',
};
