/**
 * Presentation Hooks Export
 * @description React hooks
 * Subpath: @umituz/web-design-system/hooks
 */

export { useTheme } from './useTheme';
export type { Theme, UseThemeReturn } from './useTheme';

export { useMediaQuery, useBreakpoint } from './useMediaQuery';
export type { Breakpoint, UseBreakpointReturn } from '../../domain/types/breakpoint.types';

export { useLocalStorage } from './useLocalStorage';

export { useClickOutside } from './useClickOutside';

export { useKeyboard, useEscape } from './useKeyboard';
export type { KeyboardKey, KeyboardModifier, KeyboardOptions } from './useKeyboard';

export { useDebounce } from './useDebounce';

export { useClipboard } from './useClipboard';
export type { UseClipboardReturn } from './useClipboard';

export { useToggle } from './useToggle';

export { useScrollLock } from './useScrollLock';

export { useLanguage } from './useLanguage';
export type { Language, SupportedLanguage, UseLanguageReturn } from './useLanguage';
