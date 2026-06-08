/**
 * Validation Result
 * @description Shared validation result and config types
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationConfig {
  allowHtml?: boolean;
  stripTags?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
}
