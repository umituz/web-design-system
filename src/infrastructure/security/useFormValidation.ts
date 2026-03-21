import { useState, useCallback, useMemo } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  message?: string;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

export interface FormData {
  [fieldName: string]: string | number | boolean | string[];
}

const validateField = (value: string | number | boolean | string[], rule: ValidationRule): string | null => {
  const stringValue = Array.isArray(value) ? value.join(',') : String(value);

  if (rule.required && (!stringValue || stringValue.trim() === '')) {
    return rule.message || 'This field is required';
  }

  if (!stringValue || stringValue.trim() === '') {
    return null;
  }

  if (rule.minLength && stringValue.length < rule.minLength) {
    return rule.message || `Must be at least ${rule.minLength} characters`;
  }

  if (rule.maxLength && stringValue.length > rule.maxLength) {
    return rule.message || `Must be no more than ${rule.maxLength} characters`;
  }

  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return rule.message || 'Invalid format';
  }

  if (rule.custom) {
    return rule.custom(stringValue);
  }

  return null;
};

export const sanitizeInput = (value: string): string => {
  return value
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ');
};

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s\-()]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/,
} as const;

export const COMMON_RULES = {
  required: { required: true },
  email: {
    pattern: VALIDATION_PATTERNS.email,
    message: 'Please enter a valid email address'
  },
  url: {
    pattern: VALIDATION_PATTERNS.url,
    message: 'Please enter a valid URL'
  },
  phone: {
    pattern: VALIDATION_PATTERNS.phone,
    message: 'Please enter a valid phone number'
  },
  shortText: { maxLength: 100 },
  mediumText: { maxLength: 500 },
  longText: { maxLength: 2000 },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: VALIDATION_PATTERNS.noSpecialChars,
    message: 'Name must be 2-50 characters and contain only letters, numbers, and spaces'
  },
  description: {
    minLength: 10,
    maxLength: 500,
    message: 'Description must be 10-500 characters'
  },
} as const;

export const useFormValidation = <T extends FormData>(
  initialData: T,
  validationRules: ValidationRules = {}
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateSingleField = useCallback((fieldName: string, value: string | number | boolean | string[]): string | null => {
    const rule = validationRules[fieldName];
    if (!rule) return null;

    return validateField(value, rule);
  }, [validationRules]);

  const validateAllFields = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName];
      const error = validateSingleField(fieldName, value);

      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateSingleField, validationRules]);

  const updateField = useCallback((fieldName: string, value: string | number | boolean | string[]) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;

    setFormData(prev => ({ ...prev, [fieldName]: sanitizedValue }));

    setTouched(prev => ({ ...prev, [fieldName]: true }));

    if (touched[fieldName] || value !== '') {
      const error = validateSingleField(fieldName, sanitizedValue);
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    }
  }, [touched, validateSingleField]);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const setFormDataWithValidation = useCallback((newData: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...newData }));

    const newErrors: ValidationErrors = {};
    Object.keys(newData).forEach(fieldName => {
      if (validationRules[fieldName]) {
        const fieldValue = newData[fieldName];
        const error = validateSingleField(fieldName, fieldValue as string | number | boolean | string[]);
        if (error) {
          newErrors[fieldName] = error;
        }
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
  }, [validateSingleField, validationRules]);

  const getFieldProps = useCallback((fieldName: string) => ({
    value: formData[fieldName] || '',
    onChange: (value: string | number | boolean | string[]) => updateField(fieldName, value),
    onBlur: () => {
      setTouched(prev => ({ ...prev, [fieldName]: true }));
      const error = validateSingleField(fieldName, formData[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    },
    error: errors[fieldName],
    isValid: !errors[fieldName] && touched[fieldName],
  }), [formData, errors, touched, updateField, validateSingleField]);

  const isFormValid = useMemo(() => {
    return Object.keys(validationRules).every(fieldName => !errors[fieldName]);
  }, [errors, validationRules]);

  const hasErrors = useMemo(() => {
    return Object.values(errors).some(error => error !== '');
  }, [errors]);

  const touchedFields = useMemo(() => {
    return Object.keys(touched).filter(fieldName => touched[fieldName]);
  }, [touched]);

  return {
    formData,
    errors,
    touched,
    isFormValid,
    hasErrors,
    touchedFields,
    updateField,
    validateAllFields,
    validateSingleField,
    clearFieldError,
    clearAllErrors,
    resetForm,
    setFormDataWithValidation,
    getFieldProps,
  };
};
