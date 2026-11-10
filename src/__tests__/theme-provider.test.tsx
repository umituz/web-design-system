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
  accessiaTheme,
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

  it('retrieves default and built-in themes by name', () => {
    expect(getTheme('accessia').name).toBe('accessia');
    expect(getTheme('hangora').name).toBe('hangora');
    expect(getTheme('default').name).toBe('default');
    expect(getTheme('non-existent').name).toBe('default');
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
    const css = themeToCssVariables(accessiaTheme);
    expect(css).toContain('--color-primary: #4e8cff;');
    expect(css).toContain('--app-primary: #4e8cff;');
    expect(css).toContain('--color-background: #060a12;');
    expect(css).toContain('--bg-0: #060a12;');
    expect(css).toContain('--font-sans:');
  });

  it('applies theme variables to document head', () => {
    applyTheme(accessiaTheme);
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
      <DesignSystemProvider theme="accessia" mode="dark">
        <Consumer />
      </DesignSystemProvider>
    );

    expect(screen.getByTestId('theme-name').textContent).toBe('accessia');
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
});
