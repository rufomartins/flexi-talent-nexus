import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CastingFormField } from '../types';

export const useCastingForm = (castingId: string) => {
  const [customFields, setCustomFields] = useState<CastingFormField[]>([]);
  
  const addField = (field: Omit<CastingFormField, 'id' | 'position'>) => {
    const newField = {
      ...field,
      id: uuidv4(),
      position: customFields.length
    };
    setCustomFields([...customFields, newField]);
  };

  const updateField = (id: string, updates: Partial<CastingFormField>) => {
    setCustomFields(fields => 
      fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  return {
    customFields,
    addField,
    updateField
  };
};