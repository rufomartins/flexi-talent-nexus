import React from 'react';
import { Loader } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCastingForm } from './CastingFormContext';

interface ProjectManagerSelectProps {
  projectManagers: Array<{ id: string; full_name: string }>;
  isLoading: boolean;
}

export function ProjectManagerSelect({ projectManagers, isLoading }: ProjectManagerSelectProps) {
  const { form } = useCastingForm();
  const { errors } = form.formState;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Project Manager</label>
      <Select
        value={form.watch('project_manager_id') || ''}
        onValueChange={(value) => form.setValue('project_manager_id', value)}
      >
        <SelectTrigger className={`w-full ${errors.project_manager_id ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select a project manager" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
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
        <p className="mt-1 text-sm text-red-600">{errors.project_manager_id.message}</p>
      )}
    </div>
  );
}