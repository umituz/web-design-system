import type { ThemeConfig } from '../../domain/types';
import { defaultTheme } from './default.theme';
import { oceanTheme } from './ocean.theme';
import { midnightTheme } from './midnight.theme';
import { editorialTheme } from './editorial.theme';

const themeRegistry = new Map<string, ThemeConfig>([
  ['default', defaultTheme],
  ['ocean', oceanTheme],
  ['midnight', midnightTheme],
  ['editorial', editorialTheme],
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
