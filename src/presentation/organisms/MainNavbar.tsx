/**
 * MainNavbar Component (Organism)
 * @description Full-featured navigation bar with logo, links, theme toggle, language selector, and mobile menu
 * @note The optional `LinkComponent` prop allows consumers to provide their router's Link (e.g. react-router's Link)
 *       to avoid hard-coding a router dependency. When omitted, items render as native anchors (`<a>`).
 */

import { useState, useEffect, useRef, useMemo, type ElementType, type ReactNode } from 'react';
import { Languages, Moon, Sun, Menu, X, Github, Check } from 'lucide-react';
import { cn } from '../../infrastructure/utils';
import { IconButton } from '../atoms/IconButton';
import { Show, Hide } from '../atoms';
import type { BaseProps } from '../../domain/types';

export interface NavItem {
  name: string;
  path: string;
}

export interface MainNavbarLanguage {
  code: string;
  name: string;
  icon?: ReactNode;
}

export interface MainNavbarTranslations {
  language: string;
  switchToMode: (mode: string) => string;
  lightMode: string;
  darkMode: string;
  github: string;
  openMenu: string;
  closeMenu: string;
}

const DEFAULT_TRANSLATIONS: MainNavbarTranslations = {
  language: 'Language',
  switchToMode: (mode) => `Switch to ${mode} mode`,
  lightMode: 'Light Mode',
  darkMode: 'Dark Mode',
  github: 'GitHub',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
};

export interface MainNavbarProps extends BaseProps {
  logo?: ReactNode;
  appName: string;
  navItems: NavItem[];
  supportedLanguages: Record<string, MainNavbarLanguage>;
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  githubUrl?: string;
  githubLabel?: string;
  translations?: Partial<MainNavbarTranslations>;
  /**
   * Optional custom Link component (e.g. react-router's `Link`).
   * If omitted, the navbar renders native `<a>` elements.
   */
  LinkComponent?: ElementType;
}

export const MainNavbar = ({
  logo,
  appName,
  navItems,
  supportedLanguages,
  currentLanguage,
  onLanguageChange,
  theme,
  onThemeToggle,
  githubUrl,
  githubLabel,
  translations: translationsOverride,
  className,
  LinkComponent = 'a',
}: MainNavbarProps) => {
  const translations: MainNavbarTranslations = { ...DEFAULT_TRANSLATIONS, ...translationsOverride };
  const githubText = githubLabel ?? translations.github;

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const navItemsKey = useMemo(
    () => navItems.map((i) => i.path).join('|'),
    [navItems]
  );
  const navItemsMemo = useMemo(() => navItems, [navItemsKey]);

  useEffect(() => {
    if (!isLangOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen]);

  const isActivePath = (path: string) =>
    typeof window !== 'undefined' ? window.location.pathname === path : false;

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur transition-colors',
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <LinkComponent to="/" className="flex items-center gap-2 sm:gap-3">
          {logo}
          <span className="text-xl font-bold text-foreground">{appName}</span>
        </LinkComponent>

        <Show above="lg">
          <div className="flex items-center gap-6 lg:gap-8">
            {navItemsMemo.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <LinkComponent
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'whitespace-nowrap font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </LinkComponent>
              );
            })}
          </div>
        </Show>

        <div className="flex items-center gap-1 md:gap-2">
          <Show above="lg">
            <div className="relative" ref={langDropdownRef}>
              <IconButton
                icon={<Languages className="h-5 w-5" />}
                label={translations.language}
                onClick={() => setIsLangOpen((prev) => !prev)}
                aria-expanded={isLangOpen}
                aria-haspopup="menu"
              />

              {isLangOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-xl"
                >
                  {Object.entries(supportedLanguages).map(([code, { name, icon }]) => {
                    const isCurrent = currentLanguage === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isCurrent}
                        onClick={() => {
                          onLanguageChange(code);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors',
                          isCurrent
                            ? 'bg-muted text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        {icon}
                        <span>{name}</span>
                        {isCurrent && <Check className="ml-auto h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Show>

          <IconButton
            icon={theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            label={translations.switchToMode(theme === 'dark' ? 'light' : 'dark')}
            onClick={onThemeToggle}
          />

          <Show above="lg">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
              >
                <Github className="h-4 w-4" />
                <span>{githubText}</span>
              </a>
            )}
          </Show>

          <Hide above="lg">
            <IconButton
              icon={isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              label={isMobileOpen ? translations.closeMenu : translations.openMenu}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-expanded={isMobileOpen}
            />
          </Hide>
        </div>
      </div>

      <Hide above="lg">
        {isMobileOpen && (
          <div className="border-t border-border bg-card">
            <div className="space-y-2 px-4 py-4">
              <button
                type="button"
                onClick={onThemeToggle}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span>{theme === 'dark' ? translations.lightMode : translations.darkMode}</span>
              </button>

              <div className="px-4 py-2">
                <div className="mb-2 text-sm text-muted-foreground">{translations.language}</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(supportedLanguages).map(([code, { name, icon }]) => {
                    const isCurrent = currentLanguage === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => onLanguageChange(code)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-muted'
                        )}
                      >
                        {icon}
                        <span>{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {navItemsMemo.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <LinkComponent
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'block rounded-lg px-4 py-2 font-medium transition-colors',
                      isActive
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.name}
                  </LinkComponent>
                );
              })}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  <span>{githubText}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </Hide>
    </nav>
  );
};
