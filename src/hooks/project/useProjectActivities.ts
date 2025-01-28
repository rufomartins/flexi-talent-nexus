import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectActivity {
  id: string;
  project_id: string;
  action_type: string;
  details: Record<string, any>;
  created_at: string;
  user_id: string;
}

export function useProjectActivities(projectId: string) {
  return useQuery({
    queryKey: ["project-activities", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map(activity => ({
        id: activity.id,
        project_id: projectId,
        action_type: activity.action_type,
        details: activity.details as Record<string, any>,
        created_at: activity.created_at,
        user_id: activity.user_id
      })) as ProjectActivity[];
    }
  });
}