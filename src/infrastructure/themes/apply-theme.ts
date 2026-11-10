import type { ThemeConfig, ThemeColors } from '../../domain/types';
import { getTheme } from './registry';

function colorPropsToCss(colors: ThemeColors): string {
  const lines: string[] = [];
  const entries: [keyof ThemeColors, string][] = [
    ['background', '--color-background'],
    ['foreground', '--color-foreground'],
    ['card', '--color-card'],
    ['cardForeground', '--color-card-foreground'],
    ['popover', '--color-popover'],
    ['popoverForeground', '--color-popover-foreground'],
    ['primary', '--color-primary'],
    ['primaryForeground', '--color-primary-foreground'],
    ['secondary', '--color-secondary'],
    ['secondaryForeground', '--color-secondary-foreground'],
    ['muted', '--color-muted'],
    ['mutedForeground', '--color-muted-foreground'],
    ['accent', '--color-accent'],
    ['accentForeground', '--color-accent-foreground'],
    ['border', '--color-border'],
    ['input', '--color-input'],
    ['destructive', '--color-destructive'],
    ['destructiveForeground', '--color-destructive-foreground'],
  ];

  for (const [key, cssVar] of entries) {
    const val = colors[key];
    if (val) {
      lines.push(`${cssVar}: ${val};`);
      const appVar = cssVar.replace('--color-', '--app-');
      lines.push(`${appVar}: ${val};`);
    }
  }

  if (colors.ring) {
    lines.push(`--color-ring: ${colors.ring};`);
    lines.push(`--app-ring: ${colors.ring};`);
  }
  if (colors.success) {
    lines.push(`--color-success: ${colors.success};`);
    lines.push(`--app-success: ${colors.success};`);
  }
  if (colors.successForeground) {
    lines.push(`--color-success-foreground: ${colors.successForeground};`);
    lines.push(`--app-success-foreground: ${colors.successForeground};`);
  }
  if (colors.warning) {
    lines.push(`--color-warning: ${colors.warning};`);
    lines.push(`--app-warning: ${colors.warning};`);
  }
  if (colors.warningForeground) {
    lines.push(`--color-warning-foreground: ${colors.warningForeground};`);
    lines.push(`--app-warning-foreground: ${colors.warningForeground};`);
  }
  if (colors.info) {
    lines.push(`--color-info: ${colors.info};`);
    lines.push(`--app-info: ${colors.info};`);
  }
  if (colors.infoForeground) {
    lines.push(`--color-info-foreground: ${colors.infoForeground};`);
    lines.push(`--app-info-foreground: ${colors.infoForeground};`);
  }
  if (colors.violet) {
    lines.push(`--color-violet: ${colors.violet};`);
    lines.push(`--app-violet: ${colors.violet};`);
  }
  if (colors.violetForeground) {
    lines.push(`--color-violet-foreground: ${colors.violetForeground};`);
    lines.push(`--app-violet-foreground: ${colors.violetForeground};`);
  }
  if (colors.primarySoft) {
    lines.push(`--color-primary-soft: ${colors.primarySoft};`);
    lines.push(`--app-primary-soft: ${colors.primarySoft};`);
  }

  return lines.join('\n  ');
}

export function themeToCssVariables(theme: ThemeConfig): string {
  const rootLines: string[] = [colorPropsToCss(theme.colors)];

  if (theme.typography?.fontSans) {
    rootLines.push(`--font-sans: ${theme.typography.fontSans};`);
    rootLines.push(`--app-font-sans: ${theme.typography.fontSans};`);
  }
  if (theme.typography?.fontMono) {
    rootLines.push(`--font-mono: ${theme.typography.fontMono};`);
    rootLines.push(`--app-font-mono: ${theme.typography.fontMono};`);
  }
  if (theme.typography?.fontDisplay) {
    rootLines.push(`--font-display: ${theme.typography.fontDisplay};`);
  }

  if (theme.radii) {
    if (theme.radii.xs) rootLines.push(`--radius-xs: ${theme.radii.xs};`);
    if (theme.radii.sm) rootLines.push(`--radius-sm: ${theme.radii.sm};`);
    if (theme.radii.md) rootLines.push(`--radius-md: ${theme.radii.md};`);
    if (theme.radii.lg) rootLines.push(`--radius-lg: ${theme.radii.lg};`);
    if (theme.radii.xl) rootLines.push(`--radius-xl: ${theme.radii.xl};`);
  }

  if (theme.customVars) {
    for (const [k, v] of Object.entries(theme.customVars)) {
      rootLines.push(`--${k}: ${v};`);
    }
  }

  let css = `:root {\n  ${rootLines.join('\n  ')}\n}\n`;

  if (theme.darkColors && Object.keys(theme.darkColors).length > 0) {
    const darkMerged: ThemeColors = {
      ...theme.colors,
      ...theme.darkColors,
    };
    css += `\n.dark, [data-theme="dark"] {\n  ${colorPropsToCss(darkMerged)}\n}\n`;
  }

  return css;
}

export function applyTheme(
  themeOrName: string | ThemeConfig,
  targetDoc?: Document
): ThemeConfig {
  const theme = typeof themeOrName === 'string' ? getTheme(themeOrName) : themeOrName;
  const doc = targetDoc ?? (typeof document !== 'undefined' ? document : undefined);
  if (!doc) return theme;

  const styleId = 'umituz-theme-vars';
  let styleEl = doc.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.id = styleId;
    doc.head.appendChild(styleEl);
  }

  styleEl.textContent = themeToCssVariables(theme);

  if (theme.mode === 'dark') {
    doc.documentElement.classList.add('dark');
    doc.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme.mode === 'light') {
    doc.documentElement.classList.remove('dark');
    doc.documentElement.setAttribute('data-theme', 'light');
  }

  return theme;
}
