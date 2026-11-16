import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useAppTheme } from '../presentation/providers/ThemeProvider';

function stubMatchMedia(light: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('light') ? light : !light,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

function renderTheme(props: Parameters<typeof ThemeProvider>[0] = { children: null }) {
  return renderHook(() => useAppTheme(), { wrapper: ({ children }) => <ThemeProvider {...props}>{children}</ThemeProvider> });
}

describe('ThemeProvider', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    vi.unstubAllGlobals();
  });

  it('reads a stored preference', () => {
    stubMatchMedia(true);
    localStorage.setItem('aria:theme', 'light');
    const { result } = renderTheme({ children: null, storageKey: 'aria:theme', defaultPreference: 'dark' });
    expect(result.current.preference).toBe('light');
    expect(result.current.resolved).toBe('light');
  });

  it('falls back to the configured default for missing or invalid values', () => {
    stubMatchMedia(true);
    localStorage.setItem('aria:theme', 'banana');
    const { result } = renderTheme({ children: null, storageKey: 'aria:theme', defaultPreference: 'dark' });
    expect(result.current.preference).toBe('dark');
    expect(result.current.resolved).toBe('dark');
  });

  it('resolves system to the OS preference', () => {
    stubMatchMedia(true);
    const { result } = renderTheme({ children: null, defaultPreference: 'system' });
    expect(result.current.preference).toBe('system');
    expect(result.current.resolved).toBe('light');
  });

  it('writes the preference to storage and the document', () => {
    stubMatchMedia(false);
    const { result } = renderTheme({ children: null, storageKey: 'aria:theme', defaultPreference: 'dark' });
    act(() => result.current.setPreference('light'));
    expect(localStorage.getItem('aria:theme')).toBe('light');
    expect(result.current.resolved).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('syncs the meta theme-color element when colors are given', () => {
    stubMatchMedia(false);
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
    renderTheme({
      children: null,
      defaultPreference: 'dark',
      metaThemeColors: { light: '#f5f5f8', dark: '#0b0b0f' },
    });
    expect(meta.getAttribute('content')).toBe('#0b0b0f');
    document.head.removeChild(meta);
  });

  it('throws outside the provider', () => {
    stubMatchMedia(false);
    expect(() => renderHook(() => useAppTheme())).toThrow('useAppTheme must be used within ThemeProvider');
  });
});
