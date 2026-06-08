export * from './security-config';
export * from './validation';

// Re-export individual validator modules for tree-shakable imports
export * from './validators/validationResult';
export { validateRequired } from './validators/requiredFieldValidator';
export { validateInput } from './validators/inputTextValidator';
export { validateEmail } from './validators/emailAddressValidator';
export { validateUrl } from './validators/urlValidator';
export { validateFileName } from './validators/fileNameValidator';
export { validateCSPCompliance } from './validators/cspValidator';
export { detectDangerousHtml } from './validators/htmlDetector';
export type { HtmlDetectionConfig, HtmlDetectionResult } from './validators/htmlDetector';

export { sanitizeInput } from './sanitizers/contentSanitizer';

export {
  useFormValidation,
  COMMON_RULES,
  VALIDATION_PATTERNS,
  type ValidationRule,
  type ValidationRules,
  type ValidationErrors,
  type FormData
} from './useFormValidation';
