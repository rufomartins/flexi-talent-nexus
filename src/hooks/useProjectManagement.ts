import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Project, Task } from "@/components/projects/types";

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

interface TaskFilters {
  languageId?: string;
  translationStatus?: string;
  reviewStatus?: string;
  talentStatus?: string;
  dateRange?: { from: Date; to: Date };
}

interface NewTask {
  name: string;
  languageId: string;
  deadline: Date;
  priority: string;
  description?: string;
}

export const useProjectManagement = (projectId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch project details
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

  // Fetch project tasks with filters
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
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

  // Fetch recent activities
  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities,
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

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: NewTask) => {
      const { error } = await supabase.from("project_tasks").insert([
        {
          name: newTask.name,
          language_id: newTask.languageId,
          priority: newTask.priority,
          description: newTask.description,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      console.error("Error creating task:", error);
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { error } = await supabase
        .from("project_tasks")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      console.error("Error updating task:", error);
    },
  });

  // Filter tasks
  const filterTasks = useCallback(async (filters: TaskFilters) => {
    let query = supabase
      .from("project_tasks")
      .select("*")
      .eq("project_id", projectId);

    if (filters.languageId) {
      query = query.eq("language_id", filters.languageId);
    }

    if (filters.translationStatus) {
      query = query.eq("translation_status", filters.translationStatus as ProjectTranslationStatus);
    }

    if (filters.reviewStatus) {
      query = query.eq("review_status", filters.reviewStatus as ProjectReviewStatus);
    }

    if (filters.talentStatus) {
      query = query.eq("talent_status", filters.talentStatus as ProjectTalentStatus);
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
  }, [projectId, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel(`project-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_tasks",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          refetchTasks();
          refetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, refetchTasks, refetchActivities]);

  return {
    project,
    tasks,
    activities,
    loading: projectLoading || tasksLoading || activitiesLoading,
    error: projectError || tasksError || activitiesError,
    refreshData: async () => {
      await Promise.all([refetchTasks(), refetchActivities()]);
    },
    createTask: createTaskMutation.mutateAsync,
    updateTask: (id: string, updates: Partial<Task>) =>
      updateTaskMutation.mutateAsync({ id, updates }),
    filterTasks,
  };
};