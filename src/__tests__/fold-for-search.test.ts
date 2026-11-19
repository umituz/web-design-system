import { describe, expect, it } from 'vitest';
import { foldForSearch } from '../infrastructure/utils/format.util';

describe('foldForSearch', () => {
  it('folds Turkish dotted and dotless i', () => {
    expect(foldForSearch('Sıfırdan')).toBe('sifirdan');
    expect(foldForSearch('İstanbul')).toBe('istanbul');
    expect(foldForSearch('istanbul')).toContain(foldForSearch('ıstanbul'));
  });

  it('normalizes European diacritics and ligatures', () => {
    expect(foldForSearch('schön')).toBe('schon');
    expect(foldForSearch('café')).toBe('cafe');
    expect(foldForSearch('àèîõû')).toBe('aeiou');
    expect(foldForSearch('Ñoño')).toBe('nono');
    expect(foldForSearch('straße')).toBe('strasse');
    expect(foldForSearch('smørrebrød')).toBe('smorrebrod');
    expect(foldForSearch('łódź')).toBe('lodz');
    expect(foldForSearch('æon')).toBe('aeon');
  });

  it('preserves CJK, Cyrillic, and Thai characters', () => {
    expect(foldForSearch('한국어')).toBe('한국어');
    expect(foldForSearch('はじめまして')).toBe('はじめまして');
    expect(foldForSearch('Привет')).toBe('привет');
    expect(foldForSearch('สวัสดี')).toBe('สวัสดี');
  });

  it('strips Arabic harakat and unifies alefs and tah marbuta', () => {
    expect(foldForSearch('مَرْحَبًا')).toBe('مرحبا');
    expect(foldForSearch('أَهْلًا')).toBe('اهلا');
    expect(foldForSearch('مَرْحَبًا').includes(foldForSearch('مرحبا'))).toBe(true);
    expect(foldForSearch('إِسْلَام').includes(foldForSearch('اسلام'))).toBe(true);
  });

  it('matches mixed queries inside needle and haystack', () => {
    const haystack = foldForSearch('Sıfırdan JLPT N5 Japonca');
    expect(haystack.includes(foldForSearch('sifirdan'))).toBe(true);
    expect(haystack.includes(foldForSearch('Japonca'.toUpperCase()))).toBe(true);
  });
});
