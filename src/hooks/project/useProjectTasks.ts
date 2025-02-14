
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectTask } from "@/types/project";

export function useProjectTasks(projectId: string) {
  return useQuery<ProjectTask[]>({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          id,
          name,
          script_status,
          review_status,
          talent_status,
          delivery_status,
          priority,
          language_id,
          created_at,
          updated_at
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId
  });
}
