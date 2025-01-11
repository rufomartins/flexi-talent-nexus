import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CastingFormData } from '../../CastingFormSchema';

interface ReviewStepProps {
  form: UseFormReturn<CastingFormData>;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function ReviewStep({ form }: ReviewStepProps) {
  const formData = form.getValues();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-4">Review Casting Details</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1">{formData.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="mt-1 capitalize">{formData.type}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1 capitalize">{formData.status}</p>
            </div>

            {formData.type === 'external' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Show Briefing on Sign-up
                  </label>
                  <p className="mt-1">{formData.show_briefing ? 'Yes' : 'No'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Allow Talent Portal
                  </label>
                  <p className="mt-1">{formData.allow_talent_portal ? 'Yes' : 'No'}</p>
                </div>
              </>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Briefing</label>
            <div 
              className="mt-1 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.briefing || '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}