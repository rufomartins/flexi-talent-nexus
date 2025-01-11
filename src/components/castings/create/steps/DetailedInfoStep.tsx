import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CastingFormData } from '../../CastingFormSchema';

interface DetailedInfoStepProps {
  form: UseFormReturn<CastingFormData>;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function DetailedInfoStep({ form }: DetailedInfoStepProps) {
  const castingType = form.watch('type');

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="briefing"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Briefing</FormLabel>
            <FormControl>
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Enter casting briefing..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {castingType === 'external' && (
        <>
          <FormField
            control={form.control}
            name="show_briefing"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Show Briefing on Sign-up Form</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allow_talent_portal"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Allow Talent Portal Access</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}