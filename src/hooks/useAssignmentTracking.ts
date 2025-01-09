import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";

export function useAssignmentTracking(taskId: string, roleType: string) {
  const queryClient = useQueryClient();

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', taskId, roleType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_assignments')
        .select(`
          *,
          user:users(id, full_name),
          history:assignment_history(*)
        `)
        .eq('task_id', taskId)
        .eq('role_type', roleType)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ newStatus }: { newStatus: string }) => {
      const { error } = await supabase
        .from('role_assignments')
        .update({ 
          status: newStatus,
          last_updated: new Date().toISOString()
        })
        .eq('id', assignment?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment', taskId, roleType] });
      notify.success('Status updated successfully');
    },
    onError: () => {
      notify.error('Failed to update status');
    }
  });

  const updateDeadlines = useMutation({
    mutationFn: async ({ 
      startDate,
      dueDate 
    }: { 
      startDate: Date;
      dueDate: Date;
    }) => {
      const { error } = await supabase
        .from('role_assignments')
        .update({
          start_date: startDate.toISOString(),
          due_date: dueDate.toISOString(),
          last_updated: new Date().toISOString()
        })
        .eq('id', assignment?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment', taskId, roleType] });
      notify.success('Deadlines updated successfully');
    },
    onError: () => {
      notify.error('Failed to update deadlines');
    }
  });

  return {
    assignment,
    isLoading,
    updateStatus,
    updateDeadlines
  };
}