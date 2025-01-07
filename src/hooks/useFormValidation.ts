import { useState, useCallback } from 'react';
import { ValidationErrors } from '@/types/casting';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any, rules: Record<string, (value: any) => string | undefined>) => {
    const fieldErrors: string[] = [];
    
    Object.entries(rules).forEach(([ruleName, validateRule]) => {
      const error = validateRule(value);
      if (error) fieldErrors.push(error);
    });

    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[0]
    }));

    return fieldErrors.length === 0;
  }, []);

  const markTouched = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    touched,
    validateField,
    markTouched,
    clearErrors
  };
};