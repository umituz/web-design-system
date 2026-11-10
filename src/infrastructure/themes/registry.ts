import type { ThemeConfig } from '../../domain/types';
import { accessiaTheme } from './accessia.theme';
import { hangoraTheme } from './hangora.theme';
import { defaultTheme } from './default.theme';

const themeRegistry = new Map<string, ThemeConfig>([
  ['default', defaultTheme],
  ['accessia', accessiaTheme],
  ['hangora', hangoraTheme],
]);

export function registerTheme(theme: ThemeConfig): void {
  themeRegistry.set(theme.name, theme);
}

export function getTheme(name: string): ThemeConfig {
  return themeRegistry.get(name) ?? defaultTheme;
}

export function hasTheme(name: string): boolean {
  return themeRegistry.has(name);
}

export function listThemes(): string[] {
  return Array.from(themeRegistry.keys());
}
