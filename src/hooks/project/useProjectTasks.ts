
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProjectTaskStatus = 'Pending' | 'In Progress' | 'Approved';
export type ProjectReviewStatus = 'Internal Review' | 'Client Review' | 'Approved';
export type ProjectTalentStatus = 'Booked' | 'Shooting' | 'Delivered' | 'Reshoot' | 'Approved';
export type ProjectDeliveryStatus = 'Pending' | 'Delivered' | 'R Pending';

interface ProjectTask {
  id: string;
  name: string;
  script_status: ProjectTaskStatus;
  review_status: ProjectReviewStatus;
  talent_status: ProjectTalentStatus;
  delivery_status: ProjectDeliveryStatus;
  priority?: string;
  language_id: string;
}

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
          language_id
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      return data;
    },
    enabled: !!projectId
  });
}
