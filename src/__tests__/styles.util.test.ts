import { describe, it, expect } from 'vitest';
import { createStyles, cssVars } from '../infrastructure/utils/styles.util';

describe('createStyles utility', () => {
  it('creates scoped class names matching prefix__property pattern', () => {
    const styles = createStyles('LiveChat');
    expect(styles.container).toBe('LiveChat__container');
    expect(styles.message).toBe('LiveChat__message');
    expect(styles['themeOption--selected']).toBe('LiveChat__themeOption--selected');
    expect(styles.unknownKey).toBe('LiveChat__unknownKey');
  });

  it('handles empty property or symbol safely', () => {
    const styles = createStyles('TestModule');
    expect(styles['']).toBe('TestModule__');
  });
});

describe('cssVars utility', () => {
  it('passes custom properties through for React style objects', () => {
    const style = cssVars({ '--persona-color': '#f472b6', '--panel-size': '12px' });
    expect(style).toEqual({ '--persona-color': '#f472b6', '--panel-size': '12px' });
  });

  it('returns an empty object for no vars', () => {
    expect(cssVars({})).toEqual({});
  });
});
