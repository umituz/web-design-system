/**
 * Required Field Validator
 * @description Validates that a required field has a non-empty value
 */

import type { ValidationResult } from './validationResult';

export const validateRequired = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'This field is required' };
  }
  return { isValid: true };
};
