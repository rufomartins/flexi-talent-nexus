import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectItem } from "@/components/projects/types";

type TaskStatus = 'Pending' | 'Approved' | 'In Progress';
type ReviewStatus = 'Internal Review' | 'Client Review' | 'Approved';
type TalentStatus = 'Delivered' | 'Approved' | 'Booked' | 'Shooting' | 'Reshoot';

interface TaskFilters {
  languageId?: string;
  scriptStatus?: TaskStatus;
  reviewStatus?: ReviewStatus;
  talentStatus?: TalentStatus;
  dateRange?: { from: Date; to: Date };
}

export const useProjectTasks = (projectId: string) => {
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
    if (error) throw error;

    return data as ProjectItem[];
  };

  return {
    tasks,
    isLoading,
    error,
    filterTasks,
  };
};