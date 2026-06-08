/**
 * CSP Validator
 * @description Validates that content meets Content Security Policy requirements
 */

import type { ValidationResult } from './validationResult';

const SCRIPT_VIOLATION_PATTERNS: readonly RegExp[] = [
  /<script[^>]*>/gi,
  /<script/gi,
  /<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:\s*text\/html/gi,
  /data:\s*application\/javascript/gi,
];

const STYLE_BLOCK_PATTERN = /<style[^>]*>[\s\S]*?<\/style>/gi;

export const validateCSPCompliance = (content: string): ValidationResult => {
  const violations: string[] = [];

  for (const pattern of SCRIPT_VIOLATION_PATTERNS) {
    if (pattern.test(content)) {
      violations.push('Potentially dangerous script content detected');
      break;
    }
  }

  if (STYLE_BLOCK_PATTERN.test(content)) {
    violations.push('Inline style blocks not allowed');
  }

  if (violations.length > 0) {
    return {
      isValid: false,
      error: `Content Security Policy violations: ${violations.join(', ')}`,
    };
  }

  return { isValid: true };
};
