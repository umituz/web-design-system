/**
 * MainNavbar Component (Organism)
 * @description Full-featured navigation bar with logo, links, theme toggle, language selector, and mobile menu
 */

import { useState, useEffect, useRef, useMemo } from 'react';
// @ts-ignore - react-router-dom is a peer dependency, may not be available during package build
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import type { BaseProps } from '../../domain/types';

export interface NavItem {
  name: string;
  path: string;
}

export interface MainNavbarLanguage {
  code: string;
  name: string;
  flag: string;
}

export interface MainNavbarProps extends BaseProps {
  logo?: React.ReactNode;
  appName: string;
  navItems: NavItem[];
  supportedLanguages: Record<string, MainNavbarLanguage>;
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  githubUrl?: string;
  githubLabel?: string;
  translations?: {
    language: string;
    switchToMode: (mode: string) => string;
    lightMode: string;
    darkMode: string;
    github: string;
  };
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
  githubLabel = 'GitHub',
  translations = {
    language: 'Language',
    switchToMode: (mode: string) => `Switch to ${mode} mode`,
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    github: 'GitHub',
  },
  className,
}: MainNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const navItemsMemo = useMemo(() => navItems, [JSON.stringify(navItems)]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isLangOpen]);

  return (
    <nav className={`bg-bg-primary sticky top-0 z-50 border-b border-border transition-theme ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {logo || <span className="text-xl font-bold text-text-primary">{appName}</span>}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItemsMemo.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors transition-theme ${
                    isActive ? 'text-primary-light' : 'text-text-secondary hover:text-primary-light'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-lg bg-bg-secondary text-text-secondary hover:text-primary-light border border-border hover:border-primary-light transition-all transition-theme hidden md:block"
                title={translations.language}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card rounded-lg border border-border shadow-xl z-50">
                  {Object.entries(supportedLanguages).map(([code, { name, flag }]) => (
                    <button
                      key={code}
                      onClick={() => {
                        onLanguageChange(code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-bg-tertiary transition-colors transition-theme ${
                        currentLanguage === code ? 'bg-bg-tertiary text-primary-light' : 'text-text-secondary'
                      }`}
                      type="button"
                    >
                      <span className="text-xl">{flag}</span>
                      <span className="text-sm">{name}</span>
                      {currentLanguage === code && (
                        <span className="ml-auto text-primary-light">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg bg-bg-secondary text-text-secondary hover:text-primary-light border border-border hover:border-primary-light transition-all transition-theme"
              title={translations.switchToMode(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              type="button"
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* GitHub */}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-bg-secondary text-text-secondary rounded-lg border border-border hover:border-primary-light hover:text-text-primary transition-all transition-theme"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="font-medium">{githubLabel}</span>
              </a>
            )}

            {/* Mobile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-text-secondary"
              type="button"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-border transition-theme">
          <div className="px-4 py-4 space-y-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={onThemeToggle}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-bg-tertiary transition-all transition-theme"
              type="button"
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
              <span>{theme === 'dark' ? translations.lightMode : translations.darkMode}</span>
            </button>

            {/* Language Selector Mobile */}
            <div className="px-4 py-2">
              <div className="text-text-secondary text-sm mb-2">{translations.language}</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(supportedLanguages).map(([code, { name, flag }]) => (
                  <button
                    key={code}
                    onClick={() => onLanguageChange(code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all transition-theme ${
                      currentLanguage === code
                        ? 'bg-primary-light text-text-primary'
                        : 'bg-bg-primary text-text-secondary hover:bg-bg-tertiary'
                    }`}
                    type="button"
                  >
                    <span>{flag}</span>
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {navItemsMemo.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg font-medium transition-theme ${
                    isActive ? 'text-primary-light bg-bg-tertiary' : 'text-text-secondary hover:bg-bg-tertiary'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-tertiary transition-all transition-theme"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>{githubLabel}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
