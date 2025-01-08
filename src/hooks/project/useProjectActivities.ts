import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Activity {
  id: string;
  action_type: string;
  created_at: string;
  details?: {
    status?: string;
    name?: string;
    project?: string;
    [key: string]: any;
  } | null;
}

export const useProjectActivities = (projectId: string) => {
  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project-activities", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("details->project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Activity[];
    },
  });

  return {
    activities,
    isLoading,
    error,
    refetch,
  };
};