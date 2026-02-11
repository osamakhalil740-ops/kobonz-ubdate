/**
 * Accessible Form Components
 * 
 * Provides ARIA-compliant form inputs with proper labeling and error handling
 */

import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

export interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Form Field Wrapper with proper ARIA attributes
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  hint,
  required,
  children
}) => {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-gray-500">
          {hint}
        </p>
      )}

      <div>
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': [hintId, errorId].filter(Boolean).join(' '),
          'aria-invalid': error ? 'true' : 'false',
          'aria-required': required ? 'true' : 'false'
        })}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Accessible Text Input
 */
export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  error,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-primary focus:ring-primary';

  return (
    <input
      className={`${baseClasses} ${stateClasses} ${className}`}
      {...props}
    />
  );
};

/**
 * Accessible Textarea
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  error,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-primary focus:ring-primary';

  return (
    <textarea
      className={`${baseClasses} ${stateClasses} ${className}`}
      {...props}
    />
  );
};

/**
 * Accessible Select
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  error,
  options,
  placeholder,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-primary focus:ring-primary';

  return (
    <select
      className={`${baseClasses} ${stateClasses} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

/**
 * Accessible Checkbox
 */
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          className={`
            w-4 h-4 text-primary border-gray-300 rounded
            focus:ring-2 focus:ring-primary focus:ring-offset-2
            transition-colors cursor-pointer
            ${className}
          `}
          {...props}
        />
      </div>
      <div className="ml-3">
        <label
          htmlFor={id}
          className="font-medium text-gray-700 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Accessible Radio Button
 */
export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  description,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="radio"
          className={`
            w-4 h-4 text-primary border-gray-300
            focus:ring-2 focus:ring-primary focus:ring-offset-2
            transition-colors cursor-pointer
            ${className}
          `}
          {...props}
        />
      </div>
      <div className="ml-3">
        <label
          htmlFor={id}
          className="font-medium text-gray-700 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Form Section
 */
export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
