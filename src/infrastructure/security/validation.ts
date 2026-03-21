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

/**
 * Input validation with XSS protection
 * Basic sanitization without external dependencies
 */
export const validateInput = (
  input: string,
  maxLength: number = 1000,
  minLength: number = 0,
  config?: ValidationConfig
): ValidationResult => {
  const trimmed = input.trim();

  // Required field validation
  if (minLength > 0 && !trimmed) {
    return { isValid: false, error: "This field is required" };
  }

  // Length validation
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Must be less than ${maxLength} characters` };
  }

  if (trimmed.length < minLength) {
    return { isValid: false, error: `Must be at least ${minLength} characters` };
  }

  // HTML tag check for non-HTML content
  if (!config?.allowHtml) {
    if (/<[^>]*>/.test(trimmed)) {
      return { isValid: false, error: "HTML tags are not allowed" };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /data:application\/javascript/gi,
      /on\w+\s*=/gi,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(trimmed)) {
        return { isValid: false, error: "Potentially unsafe content detected" };
      }
    }
  }

  return { isValid: true };
};

/**
 * Email validation with basic security checks
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: "Email is required" };
  }

  // Check for HTML/script content
  if (/<[^>]*>/.test(trimmed)) {
    return { isValid: false, error: "Invalid characters in email address" };
  }

  // Email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /javascript:/gi,
    /data:/gi,
    /<[^>]*>/gi
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: "Invalid email format" };
    }
  }

  return { isValid: true };
};

/**
 * URL validation with security checks
 */
export const validateUrl = (url: string): ValidationResult => {
  const trimmed = url.trim();

  if (!trimmed) {
    return { isValid: false, error: "URL is required" };
  }

  // Check for HTML/script content
  if (/<[^>]*>/.test(trimmed)) {
    return { isValid: false, error: "Invalid characters in URL" };
  }

  try {
    const urlObj = new URL(trimmed);

    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'ftp:', 'ftps:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return { isValid: false, error: "Only HTTP, HTTPS, and FTP URLs are allowed" };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
};

/**
 * Required field validation
 */
export const validateRequired = (value: string): ValidationResult => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, error: "This field is required" };
  }

  return { isValid: true };
};

/**
 * Basic input sanitization
 * Removes potentially dangerous content
 */
export const sanitizeInput = (
  input: string,
  config?: ValidationConfig
): string => {
  if (!input) return '';

  let sanitized = input.trim();

  // Remove dangerous content for non-HTML input
  if (!config?.allowHtml) {
    sanitized = sanitized
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/data:application\/javascript/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<[^>]*>/g, '');
  }

  // Limit length
  return sanitized.slice(0, config?.allowHtml ? 10000 : 1000);
};

/**
 * Validate and sanitize file names
 * Prevents directory traversal and other file-based attacks
 */
export const validateFileName = (fileName: string): ValidationResult => {
  const trimmed = fileName.trim();

  if (!trimmed) {
    return { isValid: false, error: "File name is required" };
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /\.\./g, // Directory traversal
    /[<>:"|?*]/g, // Invalid file name characters
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, // Windows reserved names
    /^\./g, // Hidden files starting with dot
    /\.$/, // Files ending with dot
    /\s+$/ // Trailing whitespace
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return { isValid: false, error: "Invalid file name format" };
    }
  }

  // Length check
  if (trimmed.length > 255) {
    return { isValid: false, error: "File name too long (max 255 characters)" };
  }

  return { isValid: true };
};

/**
 * Content Security Policy helper
 * Validates that content meets basic CSP requirements
 */
export const validateCSPCompliance = (content: string): ValidationResult => {
  const violations = [];

  // Check for inline scripts
  if (/<script[^>]*>/.test(content)) {
    violations.push("Inline scripts not allowed");
  }

  // Check for inline styles
  if (/style\s*=/.test(content)) {
    violations.push("Inline styles not allowed");
  }

  // Check for javascript: URLs
  if (/javascript:/gi.test(content)) {
    violations.push("JavaScript URLs not allowed");
  }

  // Check for data: URLs with dangerous content
  if (/data:(?:text\/html|application\/javascript)/gi.test(content)) {
    violations.push("Dangerous data URLs not allowed");
  }

  if (violations.length > 0) {
    return {
      isValid: false,
      error: `Content Security Policy violations: ${violations.join(', ')}`
    };
  }

  return { isValid: true };
};
