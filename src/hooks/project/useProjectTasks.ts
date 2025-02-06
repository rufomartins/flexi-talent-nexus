import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectTask {
  id: string;
  name: string;
  status: string;
  priority: string;
  language_id: string;
}

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          id,
          name,
          status,
          priority,
          language_id
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      return data as ProjectTask[];
    },
    enabled: !!projectId
  });
}