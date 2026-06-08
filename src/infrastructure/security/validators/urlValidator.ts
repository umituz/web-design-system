/**
 * URL Validator
 * @description Validates URLs and enforces a safe-protocol allowlist
 */

import type { ValidationResult } from './validationResult';

const ALLOWED_PROTOCOLS: readonly string[] = ['http:', 'https:', 'ftp:', 'ftps:'];

export const validateUrl = (url: string): ValidationResult => {
  const trimmed = url.trim();

  if (!trimmed) {
    return { isValid: false, error: 'URL is required' };
  }

  if (/<[^>]*>/.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in URL' };
  }

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return {
        isValid: false,
        error: 'Only HTTP, HTTPS, and FTP URLs are allowed',
      };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};
