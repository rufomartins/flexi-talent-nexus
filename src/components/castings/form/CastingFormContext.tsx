import React, { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CastingFormData } from '../CastingFormSchema';

interface CastingFormContextType {
  form: UseFormReturn<CastingFormData>;
  isSubmitting: boolean;
  onSubmit: (data: CastingFormData) => Promise<void>;
}

export const CastingFormContext = createContext<CastingFormContextType | undefined>(undefined);

export const useCastingForm = () => {
  const context = useContext(CastingFormContext);
  if (!context) {
    throw new Error('useCastingForm must be used within a CastingFormProvider');
  }
  return context;
};