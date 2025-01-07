import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { supabase } from '@/integrations/supabase/client';
import type { Shot, TalentNote } from '@/types/shot-list';

interface TalentNoteFormProps {
  note?: TalentNote;
  onSubmit: (data: Partial<TalentNote>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TalentNoteForm({ note, onSubmit, onCancel, isLoading }: TalentNoteFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<Partial<TalentNote>>({
    defaultValues: note || {
      shot_reference: '',
      instructions: '',
      required_props: '',
      additional_notes: ''
    }
  });

  // Fetch available shots for reference
  const { data: shots } = useQuery({
    queryKey: ['shots', note?.shot_list_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shots')
        .select('*')
        .eq('shot_list_id', note?.shot_list_id);
      
      if (error) throw error;
      return data as Shot[];
    }
  });

  // Watch form values for rich text editor
  const instructions = watch('instructions');

  useEffect(() => {
    if (note) {
      setValue('shot_reference', note.shot_reference || '');
      setValue('instructions', note.instructions || '');
      setValue('required_props', note.required_props || '');
      setValue('additional_notes', note.additional_notes || '');
    }
  }, [note, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Shot Reference</label>
          <select
            {...register('shot_reference')}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a shot</option>
            {shots?.map((shot) => (
              <option key={shot.id} value={shot.id}>
                Shot {shot.shot_number} - {shot.description}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Required Props</label>
          <input
            type="text"
            {...register('required_props')}
            className="w-full p-2 border rounded-md"
            placeholder="List required props"
          />
        </div>
      </div>

      <div className="space-y-2">
        <RichTextEditor
          label="Instructions"
          value={instructions || ''}
          onChange={(value) => setValue('instructions', value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Additional Notes</label>
        <textarea
          {...register('additional_notes')}
          className="w-full p-2 border rounded-md min-h-[100px]"
          placeholder="Any additional notes or comments"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {note ? 'Update' : 'Add'} Note
        </Button>
      </div>
    </form>
  );
}