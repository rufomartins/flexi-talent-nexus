import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskStatus {
  id: string;
  status: string;
}

export function ShotListManagement({ taskId }: { taskId: string }) {
  const { data: task } = useQuery({
    queryKey: ['task-status', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('id, status')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return data as TaskStatus;
    }
  });

  const handleStatusUpdate = async (newStatus: string) => {
    const { error } = await supabase
      .from('project_tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Shot List Status</h3>
      <div className="flex items-center gap-4">
        <select
          value={task?.status || 'pending'}
          onChange={(e) => handleStatusUpdate(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}