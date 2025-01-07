import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { CastingFormContext } from './form/CastingFormContext';
import { ProjectManagerSelect } from './form/ProjectManagerSelect';
import { CastingFormActions } from './form/CastingFormActions';
import { CastingLogoUpload } from './CastingLogoUpload';
import { castingFormSchema, defaultValues, CastingFormData } from './CastingFormSchema';
import { notify } from '@/utils/notifications';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewCastingFormProps {
  type: 'internal' | 'external';
}

export function NewCastingForm({ type }: NewCastingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectManagers, setProjectManagers] = useState([]);
  const [isLoadingPMs, setIsLoadingPMs] = useState(false);

  const form = useForm<CastingFormData>({
    resolver: zodResolver(castingFormSchema),
    defaultValues: {
      ...defaultValues,
      type,
      casting_type: type
    }
  });

  useEffect(() => {
    const fetchProjectManagers = async () => {
      setIsLoadingPMs(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name')
          .eq('role', 'super_user');

        if (error) throw error;
        setProjectManagers(data || []);
      } catch (error) {
        console.error('Error fetching project managers:', error);
        notify.error('Failed to load project managers');
      } finally {
        setIsLoadingPMs(false);
      }
    };

    fetchProjectManagers();
  }, []);

  const onSubmit = async (formData: CastingFormData) => {
    setIsSubmitting(true);
    try {
      const user = await supabase.auth.getUser();
      const submissionData = {
        ...formData,
        name: formData.name.trim(),
        type: formData.type,
        casting_type: formData.casting_type,
        created_by: user.data.user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_id: formData.client_id || null,
        project_manager_id: formData.project_manager_id || null,
        scout_id: formData.scout_id || null,
        briefing: formData.briefing || null,
        description: formData.description || null,
        logo_url: formData.logo_url || null
      };

      const { error } = await supabase
        .from('castings')
        .insert(submissionData);

      if (error) throw error;

      notify.success('Casting created successfully');
      window.history.back();
    } catch (error) {
      console.error('Error submitting form:', error);
      notify.error('Failed to create casting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CastingFormContext.Provider value={{ form, isSubmitting, onSubmit }}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <CastingLogoUpload 
            form={form} 
            onUploadClick={() => {
              console.log('Upload clicked');
            }} 
          />
          
          <ProjectManagerSelect 
            projectManagers={projectManagers}
            isLoading={isLoadingPMs}
          />

          <RichTextEditor
            label="Briefing (will be sent to talents in availability mails)"
            value={form.watch('briefing') || ''}
            onChange={(value: string) => form.setValue('briefing', value)}
            error={form.formState.errors.briefing?.message}
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Show briefing on sign-up form
            </label>
            <Select
              value={form.watch('show_briefing').toString()}
              onValueChange={(value) => form.setValue('show_briefing', value === 'true')}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Allow talents to apply using talent portal
            </label>
            <Select
              value={form.watch('allow_talent_portal').toString()}
              onValueChange={(value) => form.setValue('allow_talent_portal', value === 'true')}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select
              value={form.watch('status')}
              onValueChange={(value) => form.setValue('status', value as 'open' | 'closed')}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CastingFormActions />
        </div>
      </form>
    </CastingFormContext.Provider>
  );
}