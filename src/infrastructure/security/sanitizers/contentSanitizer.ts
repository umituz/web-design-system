/**
 * Content Sanitizer
 * @description Removes dangerous content from free-text input
 */

import type { ValidationConfig } from '../validators/validationResult';

const DEFAULT_SAFE_LENGTH = 1000;
const ALLOWED_HTML_LENGTH = 10000;

const STRIP_TARGETS: ReadonlyArray<{ pattern: RegExp; replacement: string }> = [
  { pattern: /javascript:/gi, replacement: '' },
  { pattern: /vbscript:/gi, replacement: '' },
  { pattern: /data:text\/html/gi, replacement: '' },
  { pattern: /data:application\/javascript/gi, replacement: '' },
  { pattern: /on\w+\s*=/gi, replacement: '' },
  { pattern: /<[^>]*>/g, replacement: '' },
];

export const sanitizeInput = (input: string, config?: ValidationConfig): string => {
  if (!input) return '';

  let sanitized = input.trim();

  if (!config?.allowHtml) {
    for (const { pattern, replacement } of STRIP_TARGETS) {
      sanitized = sanitized.replace(pattern, replacement);
    }
  }

  const lengthCap = config?.allowHtml ? ALLOWED_HTML_LENGTH : DEFAULT_SAFE_LENGTH;
  return sanitized.slice(0, lengthCap);
};
