import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { TypeSelectionStep } from './steps/TypeSelectionStep';
import { DetailedInfoStep } from './steps/DetailedInfoStep';
import { FormFieldsStep } from './steps/FormFieldsStep';
import { ReviewStep } from './steps/ReviewStep';
import { castingFormSchema, CastingFormData, defaultValues } from '../CastingFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import { Loader } from 'lucide-react';

const steps = [
  { id: 1, title: 'Basic Information', component: BasicInfoStep },
  { id: 2, title: 'Casting Type', component: TypeSelectionStep },
  { id: 3, title: 'Detailed Information', component: DetailedInfoStep },
  { id: 4, title: 'Form Fields', component: FormFieldsStep },
  { id: 5, title: 'Review', component: ReviewStep },
];

export function CastingCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CastingFormData>({
    resolver: zodResolver(castingFormSchema),
    defaultValues
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (data: CastingFormData) => {
    setIsSubmitting(true);
    try {
      const { user } = await supabase.auth.getUser();
      
      const castingData = {
        ...data,
        created_by: user?.id
      };

      const { error } = await supabase
        .from('castings')
        .insert(castingData);

      if (error) throw error;

      notify.success('Casting created successfully');
      window.history.back();
    } catch (error) {
      console.error('Error creating casting:', error);
      notify.error('Failed to create casting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{steps[currentStep - 1].title}</h2>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded ${
                step.id <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CurrentStepComponent
          form={form}
          onNext={handleNext}
          onBack={handleBack}
          isLastStep={currentStep === steps.length}
        />

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          
          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Casting'
              )}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}