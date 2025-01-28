import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectActivity {
  id: string;
  project_id: string;
  action_type: string;
  details: Record<string, any>;
  created_at: string;
}

export const useProjectActivities = (projectId: string) => {
  return useQuery({
    queryKey: ["project-activities", projectId],
    queryFn: async (): Promise<ProjectActivity[]> => {
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("details->project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as ProjectActivity[];
    },
  });
};