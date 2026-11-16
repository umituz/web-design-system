import { describe, expect, it } from 'vitest';
import { initialsOf, nameHue, colorForName, NAME_COLOR_PALETTE, hashSeed } from '../infrastructure/utils';

describe('initialsOf', () => {
  it('takes first and last word initials', () => {
    expect(initialsOf('Kemal Sunal')).toBe('KS');
  });

  it('uses the first two letters of a single word', () => {
    expect(initialsOf('Suna')).toBe('SU');
  });

  it('skips middle words', () => {
    expect(initialsOf('Ada Lovelace Byron')).toBe('AB');
  });

  it('collapses repeated whitespace and trims', () => {
    expect(initialsOf('  Yasar   Kemal ')).toBe('YK');
  });

  it('returns empty for blank input', () => {
    expect(initialsOf('   ')).toBe('');
    expect(initialsOf('')).toBe('');
  });
});

describe('nameHue', () => {
  it('stays within the hue range', () => {
    for (const seed of ['a', 'b', 'buildora', 'x-y-z', 'Zeynep Hoca']) {
      const hue = nameHue(seed);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
      expect(Number.isInteger(hue)).toBe(true);
    }
  });

  it('is deterministic for the same seed', () => {
    expect(nameHue('petvia')).toBe(nameHue('petvia'));
  });

  it('spreads different seeds across the wheel', () => {
    const hues = new Set(['aa', 'ab', 'ba', 'bb', 'cc'].map(nameHue));
    expect(hues.size).toBeGreaterThan(1);
  });
});

describe('colorForName', () => {
  it('picks from the default palette by hash index', () => {
    expect(colorForName('dev_aria')).toBe(NAME_COLOR_PALETTE[hashSeed('dev_aria') % NAME_COLOR_PALETTE.length]);
  });

  it('is deterministic for the same name', () => {
    expect(colorForName('streamer')).toBe(colorForName('streamer'));
  });

  it('returns a value from the palette', () => {
    for (const name of ['ada', 'grace', 'linus', 'margaret']) {
      expect(NAME_COLOR_PALETTE).toContain(colorForName(name));
    }
  });

  it('honours a custom palette', () => {
    expect(colorForName('whoever', ['#ff0000', '#00ff00'])).toBe(
      ['#ff0000', '#00ff00'][hashSeed('whoever') % 2],
    );
  });
});
