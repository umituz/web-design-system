/**
 * useLanguage Hook
 * @description Language management with i18n integration
 */

import { useTranslation } from 'react-i18next';

export type Language = string;

export interface SupportedLanguage {
  name: string;
  flag: string;
}

export interface UseLanguageReturn {
  currentLanguage: Language;
  changeLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, unknown>) => string;
  supportedLanguages: Record<Language, SupportedLanguage>;
}

/**
 * Validates if a language code exists in supported languages
 */
function isValidLanguage(
  code: string,
  supportedLanguages: Record<Language, SupportedLanguage>
): boolean {
  return Object.keys(supportedLanguages).includes(code);
}

/**
 * Normalizes language code to match supported languages
 * Tries exact match first, then tries to match by language code prefix
 */
function normalizeLanguage(
  code: string,
  supportedLanguages: Record<Language, SupportedLanguage>,
  defaultLanguage: Language
): Language {
  // If code is valid, return it
  if (isValidLanguage(code, supportedLanguages)) {
    return code;
  }

  // Try to extract language code (e.g., 'en-US' -> 'en')
  const [language] = code.split('-');
  const matchedKey = Object.keys(supportedLanguages).find((key) =>
    key.startsWith(language)
  );

  return (matchedKey as Language) || defaultLanguage;
}

/**
 * Language management hook with i18n integration
 *
 * @example
 * ```tsx
 * const { currentLanguage, changeLanguage, t, supportedLanguages } = useLanguage({
 *   defaultLanguage: 'en-US',
 *   supportedLanguages: {
 *     'en-US': { name: 'English', flag: '🇺🇸' },
 *     'tr-TR': { name: 'Türkçe', flag: '🇹🇷' },
 *   }
 * });
 *
 * // Change language
 * changeLanguage('tr-TR');
 *
 * // Translate
 * const title = t('common.title');
 * ```
 */
export function useLanguage(options?: {
  defaultLanguage?: Language;
  supportedLanguages?: Record<Language, SupportedLanguage>;
}): UseLanguageReturn {
  const {
    defaultLanguage = 'en-US',
    supportedLanguages = {} as Record<Language, SupportedLanguage>,
  } = options || {};

  const { t, i18n } = useTranslation();

  // Safely get and validate current language
  const currentLanguage: Language = normalizeLanguage(
    i18n.language,
    supportedLanguages,
    defaultLanguage
  );

  const changeLanguage = (language: Language) => {
    // Validate language before changing
    if (isValidLanguage(language, supportedLanguages)) {
      i18n.changeLanguage(language);
    } else {
      // Fall back to default language
      i18n.changeLanguage(defaultLanguage);
    }
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    supportedLanguages,
  };
}
