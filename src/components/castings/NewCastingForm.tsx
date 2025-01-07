import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { validateCastingForm } from '@/utils/validation';
import { supabase } from '@/integrations/supabase/client';
import { CastingFormData, ValidationErrors, CastingType } from '@/types/casting';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface NewCastingFormProps {
  type: CastingType;
}

export const NewCastingForm: React.FC<NewCastingFormProps> = ({ type }) => {
  const [formData, setFormData] = useState<CastingFormData>({
    name: '',
    client_id: null,
    project_manager_id: null,
    talent_briefing: '',
    show_briefing: false,
    allow_talent_portal: false,
    description: '',
    status: 'open',
    casting_type: type
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectManagers, setProjectManagers] = useState([]);
  const [isLoadingPMs, setIsLoadingPMs] = useState(false);

  useEffect(() => {
    const fetchProjectManagers = async () => {
      setIsLoadingPMs(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name')
          .eq('role', 'project_manager');

        if (error) throw error;
        setProjectManagers(data);
      } catch (error) {
        console.error('Error fetching project managers:', error);
      } finally {
        setIsLoadingPMs(false);
      }
    };

    fetchProjectManagers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validationErrors = validateCastingForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Submit form logic here
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Project Manager Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Project Manager</label>
          <Select
            value={formData.project_manager_id || ''}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, project_manager_id: value }))
            }
          >
            <SelectTrigger className={`w-full ${errors.project_manager_id ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select a project manager" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingPMs ? (
                <div className="p-2 flex items-center justify-center">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                projectManagers.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id}>
                    {pm.full_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.project_manager_id && (
            <p className="mt-1 text-sm text-red-600">{errors.project_manager_id}</p>
          )}
        </div>

        {/* Talent Briefing */}
        <RichTextEditor
          label="Talent briefing (will be sent to talents in availability mails)"
          value={formData.talent_briefing}
          onChange={(e) => setFormData(prev => ({ ...prev, talent_briefing: e.target.value }))}
          error={errors.talent_briefing}
        />

        {/* Show Briefing Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Show this briefing on the sign-up form of this casting
          </label>
          <Select
            value={formData.show_briefing.toString()}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, show_briefing: value === 'true' }))
            }
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

        {/* Allow Talent Portal Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Allow talents to apply to this casting using their "my ugc talent casting" environment
          </label>
          <Select
            value={formData.allow_talent_portal.toString()}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, allow_talent_portal: value === 'true' }))
            }
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

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select
            value={formData.status}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, status: value as 'open' | 'closed' }))
            }
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <span className="flex items-center">
                <span className="mr-1">+</span> Save
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewCastingForm;