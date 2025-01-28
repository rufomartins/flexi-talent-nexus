import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectActivity } from "@/types/activity";

export function useProjectActivities(projectId: string) {
  return useQuery({
    queryKey: ['project-activities', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          id,
          action_type,
          details,
          created_at,
          user_id,
          project_id
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(activity => ({
        id: activity.id,
        project_id: projectId,
        action_type: activity.action_type,
        details: activity.details || {},
        created_at: activity.created_at,
        user_id: activity.user_id
      })) as ProjectActivity[];
    }
  });
}