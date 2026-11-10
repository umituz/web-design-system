import type { ThemeConfig } from '../../domain/types';
import { defaultTheme } from './default.theme';
import { oceanTheme } from './ocean.theme';
import { midnightTheme } from './midnight.theme';
import { editorialTheme } from './editorial.theme';
import { forestTheme } from './forest.theme';
import { fieldTheme } from './field.theme';
import { crimsonTheme } from './crimson.theme';

const themeRegistry = new Map<string, ThemeConfig>([
  ['default', defaultTheme],
  ['ocean', oceanTheme],
  ['midnight', midnightTheme],
  ['editorial', editorialTheme],
  ['forest', forestTheme],
  ['field', fieldTheme],
  ['crimson', crimsonTheme],
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
