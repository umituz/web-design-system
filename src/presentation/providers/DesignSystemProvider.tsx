import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeConfig, ThemeMode } from '../../domain/types';
import { applyTheme, getTheme } from '../../infrastructure/themes';

export interface DesignSystemContextValue {
  theme: ThemeConfig;
  mode: 'light' | 'dark';
  setTheme: (theme: string | ThemeConfig) => void;
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
}

const DesignSystemContext = createContext<DesignSystemContextValue | null>(null);

export interface DesignSystemProviderProps {
  children: ReactNode;
  theme?: string | ThemeConfig;
  mode?: ThemeMode;
  storageKey?: string;
}

export function DesignSystemProvider({
  children,
  theme: initialTheme = 'default',
  mode: initialMode = 'system',
  storageKey = 'umituz-theme-mode',
}: DesignSystemProviderProps) {
  const [overrideTheme, setOverrideTheme] = useState<ThemeConfig | null>(null);

  const currentTheme = useMemo(() => {
    if (overrideTheme) return overrideTheme;
    return typeof initialTheme === 'string' ? getTheme(initialTheme) : initialTheme;
  }, [initialTheme, overrideTheme]);

  const [activeMode, setActiveMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return currentTheme.mode ?? 'light';
    }

    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') return stored;
    }

    if (initialMode === 'dark' || initialMode === 'light') {
      return initialMode;
    }

    if (currentTheme.mode) {
      return currentTheme.mode;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    applyTheme(currentTheme);

    const doc = document.documentElement;
    if (activeMode === 'dark') {
      doc.classList.add('dark');
      doc.setAttribute('data-theme', 'dark');
    } else {
      doc.classList.remove('dark');
      doc.setAttribute('data-theme', 'light');
    }

    if (storageKey) {
      localStorage.setItem(storageKey, activeMode);
    }
  }, [currentTheme, activeMode, storageKey]);

  const value = useMemo<DesignSystemContextValue>(() => {
    return {
      theme: currentTheme,
      mode: activeMode,
      setTheme: (t: string | ThemeConfig) => {
        setOverrideTheme(typeof t === 'string' ? getTheme(t) : t);
      },
      setMode: (m: 'light' | 'dark') => {
        setActiveMode(m);
      },
      toggleMode: () => {
        setActiveMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
      },
    };
  }, [currentTheme, activeMode]);

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem(): DesignSystemContextValue {
  const ctx = useContext(DesignSystemContext);
  if (!ctx) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return ctx;
}
