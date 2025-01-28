import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectStatus {
  id: string;
  status: string;
  updated_at: string;
}

export const useProjectStatus = (projectId: string) => {
  return useQuery({
    queryKey: ["project-status", projectId],
    queryFn: async (): Promise<ProjectStatus> => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, status, updated_at")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};