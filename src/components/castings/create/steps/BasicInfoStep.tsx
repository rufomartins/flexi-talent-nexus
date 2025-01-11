import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CastingFormData } from '../../CastingFormSchema';

interface BasicInfoStepProps {
  form: UseFormReturn<CastingFormData>;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Casting Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter casting name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Select client" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="project_manager_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Manager</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Select project manager" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}