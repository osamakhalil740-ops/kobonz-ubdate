/**
 * Input Validation Utilities
 * 
 * Provides client-side validation for forms and user inputs
 * Using native JavaScript to avoid adding external dependencies
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: unknown) => string | null;
}

/**
 * Email validation regex (RFC 5322 compliant)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation (basic international format)
 */
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

/**
 * Validate a single field
 */
export function validateField(
  value: unknown,
  rules: ValidationRule,
  fieldName: string = 'Field'
): string | null {
  // Required check
  if (rules.required && (value === null || value === undefined || value === '')) {
    return `${fieldName} is required`;
  }

  // If not required and empty, skip other validations
  if (!value && !rules.required) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} must be no more than ${rules.maxLength} characters`;
    }

    if (rules.email && !EMAIL_REGEX.test(value)) {
      return `${fieldName} must be a valid email address`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `${fieldName} format is invalid`;
    }
  }

  // Number validations
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value);

    if (rules.min !== undefined && numValue < rules.min) {
      return `${fieldName} must be at least ${rules.min}`;
    }

    if (rules.max !== undefined && numValue > rules.max) {
      return `${fieldName} must be no more than ${rules.max}`;
    }
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

/**
 * Validate multiple fields
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((fieldName) => {
    const value = data[fieldName];
    const fieldRules = rules[fieldName];
    const error = validateField(value, fieldRules, fieldName);

    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Coupon validation rules
 */
export const couponValidationRules = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  maxUses: {
    required: true,
    min: 1,
    max: 10000,
    custom: (value: unknown) => {
      if (!Number.isInteger(Number(value))) {
        return 'Max uses must be a whole number';
      }
      return null;
    }
  },
  discountValue: {
    required: true,
    min: 0.01,
    max: 99999,
    custom: (value: unknown) => {
      if (isNaN(Number(value))) {
        return 'Discount value must be a number';
      }
      return null;
    }
  },
  validityDays: {
    min: 1,
    max: 365,
    custom: (value: unknown) => {
      if (value && !Number.isInteger(Number(value))) {
        return 'Validity days must be a whole number';
      }
      return null;
    }
  },
  expiryDate: {
    custom: (value: unknown) => {
      if (!value) return null;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(date.getTime())) {
        return 'Invalid date format';
      }
      if (date < today) {
        return 'Expiry date must be in the future';
      }
      return null;
    }
  },
  affiliateCommission: {
    required: true,
    min: 0,
    max: 10000
  },
  customerRewardPoints: {
    required: true,
    min: 0,
    max: 10000
  }
};

/**
 * User signup validation rules
 */
export const signupValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    email: true,
    maxLength: 255
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 128,
    custom: (value: string) => {
      if (!/[A-Za-z]/.test(value)) {
        return 'Password must contain at least one letter';
      }
      return null;
    }
  }
};

/**
 * Customer data validation rules
 */
export const customerDataValidationRules = {
  customerName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  customerEmail: {
    email: true,
    maxLength: 255
  },
  customerPhone: {
    required: true,
    minLength: 10,
    maxLength: 20,
    pattern: PHONE_REGEX
  }
};

/**
 * Credit request validation rules
 */
export const creditRequestValidationRules = {
  requestedAmount: {
    required: true,
    min: 100,
    max: 100000,
    custom: (value: unknown) => {
      const num = Number(value);
      if (!Number.isInteger(num)) {
        return 'Credit amount must be a whole number';
      }
      if (num % 100 !== 0) {
        return 'Credit amount must be in multiples of 100';
      }
      return null;
    }
  },
  message: {
    required: true,
    minLength: 20,
    maxLength: 500
  }
};

/**
 * Real-time field validation hook helper
 */
export function createFieldValidator(rules: ValidationRule, fieldName: string) {
  return (value: unknown): string | null => {
    return validateField(value, rules, fieldName);
  };
}

/**
 * Sanitize input (remove dangerous characters)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove inline event handlers
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(email.toLowerCase());
  const isValid = EMAIL_REGEX.test(sanitized);
  
  return {
    isValid,
    sanitized,
    error: isValid ? undefined : 'Invalid email format'
  };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = phone.replace(/\s+/g, '');
  const isValid = PHONE_REGEX.test(sanitized) && sanitized.length >= 10;
  
  return {
    isValid,
    sanitized,
    error: isValid ? undefined : 'Invalid phone number'
  };
}
