/**
 * HTML Detector
 * @description Single source of truth for detecting dangerous HTML/script content
 */

export interface HtmlDetectionConfig {
  /** Allow encoded variations (e.g. &lt;script&gt;) */
  allowEncoded?: boolean;
  /** Allow data URIs with HTML */
  allowDataUriHtml?: boolean;
  /** Allow inline event handlers (onclick=) */
  allowInlineHandlers?: boolean;
}

const DANGEROUS_PATTERNS: readonly RegExp[] = [
  /<[^>]*>/gi,             // Standard HTML tags
  /<\/script>/gi,          // Closing script tags
  /<script/gi,             // Script tags
  /javascript:/gi,         // JavaScript protocol
  /vbscript:/gi,           // VBScript protocol
  /data:text\/html/gi,     // Data URI with HTML
  /on\w+\s*=/gi,           // Inline event handlers
];

const ENCODED_PATTERNS: readonly RegExp[] = [
  /&lt;[^&]*&gt;/gi,        // HTML encoded tags
  /&lt;[a-z]/gi,            // Partial encoded tags
];

const DATA_URI_JS_PATTERNS: readonly RegExp[] = [
  /data:application\/javascript/gi,
];

export interface HtmlDetectionResult {
  detected: boolean;
  pattern?: string;
}

/**
 * Detect dangerous HTML/script content in input.
 * Returns the offending pattern name when detected.
 */
export const detectDangerousHtml = (
  input: string,
  config: HtmlDetectionConfig = {}
): HtmlDetectionResult => {
  if (!input) return { detected: false };

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      return { detected: true, pattern: pattern.source };
    }
  }

  if (!config.allowDataUriHtml) {
    for (const pattern of DATA_URI_JS_PATTERNS) {
      if (pattern.test(input)) {
        return { detected: true, pattern: pattern.source };
      }
    }
  }

  if (config.allowEncoded) {
    for (const pattern of ENCODED_PATTERNS) {
      if (pattern.test(input)) {
        return { detected: true, pattern: pattern.source };
      }
    }
  }

  return { detected: false };
};
