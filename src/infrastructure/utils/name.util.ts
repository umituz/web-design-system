import { hashSeed } from './hash.util';

export const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0] ?? '';
  const last = parts[parts.length - 1] ?? '';
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
};

export const nameHue = (seed: string): number => hashSeed(seed) % 360;

export const NAME_COLOR_PALETTE = [
  '#f472b6',
  '#a78bfa',
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#fb7185',
  '#22d3ee',
  '#c084fc',
  '#4ade80',
  '#fb923c',
  '#e879f9',
  '#38bdf8',
] as const;

export const colorForName = (name: string, palette: readonly string[] = NAME_COLOR_PALETTE): string =>
  palette[hashSeed(name) % palette.length] as string;

export const mentionsAny = (text: string, names: readonly string[]): boolean => {
  const patterns = names
    .map((name) => name.trim())
    .filter((name) => name.length >= 3)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (patterns.length === 0) return false;
  return new RegExp(`\\b(?:${patterns.join('|')})\\b`, 'i').test(text);
};
