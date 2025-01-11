import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CastingFormData } from '../../CastingFormSchema';

interface TypeSelectionStepProps {
  form: UseFormReturn<CastingFormData>;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function TypeSelectionStep({ form }: TypeSelectionStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Casting Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internal" id="internal" />
                  <Label htmlFor="internal">
                    <div className="font-medium">Internal Casting</div>
                    <p className="text-sm text-gray-500">
                      Select from existing talents in the database
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external">
                    <div className="font-medium">External Casting</div>
                    <p className="text-sm text-gray-500">
                      Create a public casting call with custom application form
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}