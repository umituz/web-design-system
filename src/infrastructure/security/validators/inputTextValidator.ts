/**
 * Input Text Validator
 * @description Validates free-text input with length bounds and HTML safety
 */

import type { ValidationConfig, ValidationResult } from './validationResult';
import { detectDangerousHtml } from './htmlDetector';

const DEFAULT_MAX_LENGTH = 1000;
const DEFAULT_MIN_LENGTH = 0;

export const validateInput = (
  input: string,
  maxLength: number = DEFAULT_MAX_LENGTH,
  minLength: number = DEFAULT_MIN_LENGTH,
  config?: ValidationConfig
): ValidationResult => {
  const trimmed = input.trim();

  if (minLength > 0 && !trimmed) {
    return { isValid: false, error: 'This field is required' };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Must be less than ${maxLength} characters` };
  }

  if (trimmed.length < minLength) {
    return { isValid: false, error: `Must be at least ${minLength} characters` };
  }

  if (!config?.allowHtml) {
    const detection = detectDangerousHtml(trimmed);
    if (detection.detected) {
      return { isValid: false, error: 'HTML tags or scripts are not allowed' };
    }
  }

  return { isValid: true };
};
