import type { ValidationConfig } from './validation';

/**
 * Content Security Policy configuration
 * Helps prevent XSS attacks by controlling resource loading
 */
export const CSP_CONFIG = {
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'", "https:", "wss:"],
    'font-src': ["'self'", "https:", "data:"],
    'object-src': ["'none'"],
    'media-src': ["'self'", "https:"],
    'frame-src': ["'none'"],
    'worker-src': ["'self'"],
    'child-src': ["'none'"],
    'form-action': ["'self'"],
    'base-uri': ["'self'"],
    'manifest-src': ["'self'"
    ]
  }
} as const;

/**
 * Validation configurations for different content types
 */
export const VALIDATION_CONFIGS: Record<string, ValidationConfig> = {
  PLAIN_TEXT: {
    allowHtml: false,
    stripTags: true,
    allowedTags: [],
    allowedAttributes: []
  },

  RICH_TEXT: {
    allowHtml: true,
    stripTags: false,
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    allowedAttributes: ['class']
  },

  LINK_CONTENT: {
    allowHtml: true,
    stripTags: false,
    allowedTags: ['a', 'p', 'br', 'strong', 'em'],
    allowedAttributes: ['href', 'title', 'target']
  },

  USER_PROFILE: {
    allowHtml: false,
    stripTags: true,
    allowedTags: [],
    allowedAttributes: []
  },

  COMMENT: {
    allowHtml: true,
    stripTags: false,
    allowedTags: ['p', 'br', 'strong', 'em'],
    allowedAttributes: []
  }
} as const;

/**
 * File upload security settings
 */
export const FILE_SECURITY_CONFIG = {
  allowedMimeTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/flac'],
    video: ['video/mp4', 'video/webm', 'video/quicktime'],
    document: ['application/pdf', 'text/plain'],
    avatar: ['image/jpeg', 'image/png', 'image/webp']
  },

  maxFileSizes: {
    image: 10 * 1024 * 1024,
    audio: 100 * 1024 * 1024,
    video: 500 * 1024 * 1024,
    document: 5 * 1024 * 1024,
    avatar: 2 * 1024 * 1024
  },

  blockedExtensions: [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
    '.app', '.deb', '.pkg', '.dmg', '.rpm', '.msi', '.apk', '.ipa'
  ],

  blockedPatterns: [
    /^\./,
    /\.\.$/,
    /[<>:"|?*]/,
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
  ]
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  api: {
    default: 100,
    auth: 10,
    upload: 20,
    generation: 30,
    export: 10
  },

  actions: {
    login: 5,
    registration: 3,
    passwordReset: 3,
    contentCreation: 50,
    fileUpload: 100
  }
} as const;

/**
 * Session security configuration
 */
export const SESSION_CONFIG = {
  timeout: 720,
  refreshThreshold: 60,
  maxSessions: 5,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 720 * 60 * 1000
  }
} as const;

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
} as const;

/**
 * CORS configuration
 */
export const CORS_CONFIG = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://amaterasu.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400
} as const;

export default {
  CSP_CONFIG,
  VALIDATION_CONFIGS,
  FILE_SECURITY_CONFIG,
  RATE_LIMIT_CONFIG,
  SESSION_CONFIG,
  SECURITY_HEADERS,
  CORS_CONFIG
};
