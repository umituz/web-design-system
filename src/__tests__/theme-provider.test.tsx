import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  DesignSystemProvider,
  useDesignSystem,
} from '../presentation/providers/DesignSystemProvider';
import {
  getTheme,
  registerTheme,
  applyTheme,
  themeToCssVariables,
  createTheme,
  midnightTheme,
  editorialTheme,
  oceanTheme,
  defaultTheme,
  forestTheme,
  fieldTheme,
} from '../infrastructure/themes';
import type { ThemeConfig } from '../domain/types';

describe('Theme System and Provider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    const existing = document.getElementById('umituz-theme-vars');
    if (existing) existing.remove();
  });

  it('retrieves default and built-in themes by generic archetype name', () => {
    expect(getTheme('midnight').name).toBe('midnight');
    expect(getTheme('editorial').name).toBe('editorial');
    expect(getTheme('ocean').name).toBe('ocean');
    expect(getTheme('forest').name).toBe('forest');
    expect(getTheme('field').name).toBe('field');
    expect(getTheme('default').name).toBe('default');
    expect(getTheme('non-existent').name).toBe('default');
  });

  it('allows createTheme to customize an existing preset or define from scratch', () => {
    const customized = createTheme('midnight', {
      name: 'midnight-custom',
      colors: { primary: '#10b981' },
    });

    expect(customized.name).toBe('midnight-custom');
    expect(customized.colors.primary).toBe('#10b981');
    expect(customized.colors.background).toBe(midnightTheme.colors.background);

    const fromScratch = createTheme({
      name: 'standalone',
      colors: {
        background: '#000',
        foreground: '#fff',
        card: '#111',
        cardForeground: '#fff',
        popover: '#111',
        popoverForeground: '#fff',
        primary: '#f00',
        primaryForeground: '#fff',
        secondary: '#222',
        secondaryForeground: '#fff',
        muted: '#222',
        mutedForeground: '#888',
        accent: '#333',
        accentForeground: '#fff',
        border: '#444',
        input: '#444',
        destructive: '#f00',
        destructiveForeground: '#fff',
      },
    });
    expect(fromScratch.name).toBe('standalone');
  });

  it('registers and retrieves custom themes', () => {
    const custom: ThemeConfig = {
      name: 'custom-corp',
      colors: {
        background: '#111111',
        foreground: '#eeeeee',
        card: '#222222',
        cardForeground: '#eeeeee',
        popover: '#222222',
        popoverForeground: '#eeeeee',
        primary: '#ff0055',
        primaryForeground: '#ffffff',
        secondary: '#333333',
        secondaryForeground: '#ffffff',
        muted: '#333333',
        mutedForeground: '#888888',
        accent: '#444444',
        accentForeground: '#ffffff',
        border: '#555555',
        input: '#555555',
        destructive: '#ff0000',
        destructiveForeground: '#ffffff',
      },
    };

    registerTheme(custom);
    expect(getTheme('custom-corp').colors.primary).toBe('#ff0055');
  });

  it('converts theme config to CSS variables string', () => {
    const css = themeToCssVariables(midnightTheme);
    expect(css).toContain('--color-primary: #4e8cff;');
    expect(css).toContain('--app-primary: #4e8cff;');
    expect(css).toContain('--color-background: #060a12;');
    expect(css).toContain('--font-sans:');

    const editorialCss = themeToCssVariables(editorialTheme);
    expect(editorialCss).toContain('--color-primary: #33406b;');

    const oceanCss = themeToCssVariables(oceanTheme);
    expect(oceanCss).toContain('--color-primary: #0284c7;');

    const defaultCss = themeToCssVariables(defaultTheme);
    expect(defaultCss).toContain('--color-primary: #2563eb;');

    const forestCss = themeToCssVariables(forestTheme);
    expect(forestCss).toContain('--color-primary: #14705f;');
    expect(forestCss).toContain('--color-background: #faf9f7;');
    expect(forestCss).toContain('--color-brand-600: #14705f;');
  });

  it('applies theme variables to document head', () => {
    applyTheme(midnightTheme);
    const styleEl = document.getElementById('umituz-theme-vars');
    expect(styleEl).toBeTruthy();
    expect(styleEl?.textContent).toContain('--color-primary: #4e8cff;');
  });

  it('DesignSystemProvider provides theme and allows mode toggle', () => {
    function Consumer() {
      const { theme, mode, toggleMode, setMode } = useDesignSystem();
      return (
        <div>
          <span data-testid="theme-name">{theme.name}</span>
          <span data-testid="theme-mode">{mode}</span>
          <button data-testid="toggle-btn" onClick={toggleMode}>
            Toggle
          </button>
          <button data-testid="set-dark" onClick={() => setMode('dark')}>
            Dark
          </button>
        </div>
      );
    }

    render(
      <DesignSystemProvider theme="midnight" mode="dark">
        <Consumer />
      </DesignSystemProvider>
    );

    expect(screen.getByTestId('theme-name').textContent).toBe('midnight');
    expect(screen.getByTestId('theme-mode').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      screen.getByTestId('toggle-btn').click();
    });

    expect(screen.getByTestId('theme-mode').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => {
      screen.getByTestId('set-dark').click();
    });

    expect(screen.getByTestId('theme-mode').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('generates field theme CSS custom variables and dark mode overrides', () => {
    const css = themeToCssVariables(fieldTheme);
    expect(css).toContain('--paper: #f4f3ee;');
    expect(css).toContain('--primary-500: #357344;');
    expect(css).toContain('--font-display: \'Fraunces\', Georgia, serif;');
    expect(css).toContain('.dark, [data-theme="dark"]');
    expect(css).toContain('--paper: #10140f;');
    expect(css).toContain('--primary-500: #6aa878;');
  });
});
