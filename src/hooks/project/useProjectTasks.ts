
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectTask, ProjectLanguage } from "@/types/project";

export function useProjectTasks(languageId?: string) {
  return useQuery({
    queryKey: ["project-tasks", languageId],
    queryFn: async (): Promise<ProjectTask[]> => {
      if (!languageId) return [];
      
      const { data, error } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("language_id", languageId);

      if (error) throw error;
      return data;
    },
    enabled: !!languageId,
  });
}
