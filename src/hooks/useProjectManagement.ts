import { useCallback } from "react";
import { useProjectTasks } from "./project/useProjectTasks";
import { useProjectActivities } from "./project/useProjectActivities";
import { useProjectRealtime } from "./project/useProjectRealtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/components/projects/types";

export const useProjectManagement = (projectId: string) => {
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:clients(name),
          project_manager:users(full_name)
        `)
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data as Project;
    },
  });

  const { 
    tasks, 
    isLoading: tasksLoading, 
    error: tasksError, 
    filterTasks 
  } = useProjectTasks(projectId);

  const { 
    data: activities, 
    isLoading: activitiesLoading, 
    error: activitiesError,
    refetch: refetchActivities 
  } = useProjectActivities(projectId);

  useProjectRealtime(projectId);

  const refreshData = useCallback(async () => {
    await Promise.all([
      filterTasks({}),
      refetchActivities(),
    ]);
  }, [filterTasks, refetchActivities]);

  return {
    project,
    tasks,
    activities: activities || [],
    loading: projectLoading || tasksLoading || activitiesLoading,
    error: projectError || tasksError || activitiesError,
    refreshData,
    filterTasks,
  };
};