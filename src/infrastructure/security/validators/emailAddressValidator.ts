/**
 * Email Address Validator
 * @description Validates RFC-compatible email addresses with XSS protection
 */

import type { ValidationResult } from './validationResult';

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const SUSPICIOUS_EMAIL_PATTERNS: readonly RegExp[] = [
  /javascript:/gi,
  /data:/gi,
  /<[^>]*>/gi,
];

export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }

  if (/<[^>]*>/.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in email address' };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  for (const pattern of SUSPICIOUS_EMAIL_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: 'Invalid email format' };
    }
  }

  return { isValid: true };
};
