import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CastingFormData } from '../../CastingFormSchema';

interface FormFieldsStepProps {
  form: UseFormReturn<CastingFormData>;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function FormFieldsStep({ form }: FormFieldsStepProps) {
  const castingType = form.watch('type');

  if (castingType !== 'external') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Custom Form Fields</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Add new custom field logic
          }}
        >
          Add Field
        </Button>
      </div>

      <div className="space-y-4">
        {/* Default fields - always included */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Default Fields</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-600">
              <span className="mr-2">•</span> Full Name (Required)
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="mr-2">•</span> Email (Required)
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="mr-2">•</span> Phone Number
            </li>
          </ul>
        </div>

        {/* Custom fields will be rendered here */}
      </div>
    </div>
  );
}