/**
 * File Name Validator
 * @description Prevents directory traversal, illegal characters, and platform-reserved names
 */

import type { ValidationResult } from './validationResult';

const MAX_FILE_NAME_LENGTH = 255;

interface FileNameRule {
  pattern: RegExp;
  reason: string;
}

// Each pattern is tested once against the trimmed input.
// None of these patterns use the global flag to avoid `lastIndex` state issues.
const FILE_NAME_RULES: readonly FileNameRule[] = [
  { pattern: /\.\./, reason: 'Directory traversal' },
  { pattern: /[<>:"|?*]/, reason: 'Invalid characters' },
  { pattern: /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, reason: 'Windows reserved' },
  { pattern: /^\./, reason: 'Hidden file' },
  { pattern: /\.$/, reason: 'Trailing dot' },
  { pattern: /\s+$/, reason: 'Trailing whitespace' },
];

export const validateFileName = (fileName: string): ValidationResult => {
  const trimmed = fileName.trim();

  if (!trimmed) {
    return { isValid: false, error: 'File name is required' };
  }

  for (const { pattern, reason } of FILE_NAME_RULES) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: `Invalid file name: ${reason}` };
    }
  }

  if (trimmed.length > MAX_FILE_NAME_LENGTH) {
    return {
      isValid: false,
      error: `File name too long (max ${MAX_FILE_NAME_LENGTH} characters)`,
    };
  }

  return { isValid: true };
};
