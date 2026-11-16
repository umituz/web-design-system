import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultPreference?: ThemePreference;
  metaThemeColors?: { light: string; dark: string };
}

export interface AppThemeValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (theme: ThemePreference) => void;
}

const AppThemeContext = createContext<AppThemeValue | null>(null);

const isPreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system';

const readStoredPreference = (key: string, fallback: ThemePreference): ThemePreference => {
  try {
    const stored = localStorage.getItem(key);
    if (isPreference(stored)) return stored;
    return fallback;
  } catch {
    return fallback;
  }
};

const initialSystemResolved = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export function ThemeProvider({
  children,
  storageKey = 'theme',
  defaultPreference = 'system',
  metaThemeColors,
}: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference(storageKey, defaultPreference),
  );
  const [systemResolved, setSystemResolved] = useState<ResolvedTheme>(initialSystemResolved);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => setSystemResolved(media.matches ? 'light' : 'dark');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const resolved: ResolvedTheme = preference === 'system' ? systemResolved : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    if (metaThemeColors) {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', resolved === 'light' ? metaThemeColors.light : metaThemeColors.dark);
    }
  }, [resolved, metaThemeColors]);

  const setPreference = useCallback(
    (theme: ThemePreference) => {
      setPreferenceState(theme);
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        return;
      }
    },
    [storageKey],
  );

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeValue {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}
