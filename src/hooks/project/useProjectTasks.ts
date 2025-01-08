import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import type { Task } from "@/components/projects/types";

type ProjectTranslationStatus = Database["public"]["Enums"]["project_translation_status"];
type ProjectReviewStatus = Database["public"]["Enums"]["project_review_status"];
type ProjectTalentStatus = Database["public"]["Enums"]["project_talent_status"];

interface TaskFilters {
  languageId?: string;
  translationStatus?: ProjectTranslationStatus;
  reviewStatus?: ProjectReviewStatus;
  talentStatus?: ProjectTalentStatus;
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
      return data as Task[];
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

    if (filters.translationStatus) {
      query = query.eq("translation_status", filters.translationStatus);
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

    return data;
  };

  return {
    tasks,
    isLoading,
    error,
    filterTasks,
  };
};