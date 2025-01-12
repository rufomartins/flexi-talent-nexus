import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import type { ProjectItem } from "@/components/projects/types";

interface TaskFilters {
  languageId?: string;
  scriptStatus?: Database["public"]["Enums"]["project_script_status"];
  reviewStatus?: Database["public"]["Enums"]["project_review_status"];
  talentStatus?: Database["public"]["Enums"]["project_talent_status"];
  dateRange?: { from: Date; to: Date };
}

export const useProjectTasks = (projectId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_tasks")
        .select(`
          *,
          language:project_languages(language_name)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectItem[];
    },
  });

  const filterTasks = async (filters: TaskFilters) => {
    let query = supabase
      .from("project_tasks")
      .select("*")
      .eq("project_id", projectId);

    if (filters.languageId) {
      query = query.eq("language_id", filters.languageId);
    }

    if (filters.scriptStatus) {
      query = query.eq("script_status", filters.scriptStatus);
    }

    if (filters.reviewStatus) {
      query = query.eq("review_status", filters.reviewStatus);
    }

    if (filters.talentStatus) {
      query = query.eq("talent_status", filters.talentStatus);
    }

    if (filters.dateRange?.from && filters.dateRange?.to) {
      query = query
        .gte("created_at", filters.dateRange.from.toISOString())
        .lte("created_at", filters.dateRange.to.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Error",
        description: "Failed to filter tasks",
        variant: "destructive",
      });
      throw error;
    }

    return data as ProjectItem[];
  };

  return {
    tasks,
    isLoading,
    error,
    filterTasks,
  };
};