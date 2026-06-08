/**
 * Validation Re-exports
 * @description Backward-compatible re-export of focused validators and sanitizers.
 * New code should import directly from the focused files under
 * `./validators` and `./sanitizers`.
 */

export type { ValidationResult, ValidationConfig } from './validators/validationResult';

export { validateRequired } from './validators/requiredFieldValidator';
export { validateInput } from './validators/inputTextValidator';
export { validateEmail } from './validators/emailAddressValidator';
export { validateUrl } from './validators/urlValidator';
export { validateFileName } from './validators/fileNameValidator';
export { validateCSPCompliance } from './validators/cspValidator';

export { sanitizeInput } from './sanitizers/contentSanitizer';
