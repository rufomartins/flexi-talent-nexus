import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useProjectRealtime = (projectId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const handleTaskChange = (payload: any) => {
      console.log("Task change:", payload);
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      
      toast({
        title: "Task Updated",
        description: "Project task has been updated",
      });
    };

    const handleActivityChange = (payload: any) => {
      console.log("Activity change:", payload);
      queryClient.invalidateQueries({ queryKey: ["project-activities", projectId] });
    };

    // Subscribe to tasks changes
    const taskChannel = supabase
      .channel(`tasks-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_tasks",
          filter: `project_id=eq.${projectId}`,
        },
        handleTaskChange
      )
      .subscribe((status) => {
        console.log("Task subscription status:", status);
      });

    // Subscribe to activities
    const activityChannel = supabase
      .channel(`activities-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_activity_logs",
          filter: `details->project_id=eq.${projectId}`,
        },
        handleActivityChange
      )
      .subscribe((status) => {
        console.log("Activity subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime subscriptions");
      supabase.removeChannel(taskChannel);
      supabase.removeChannel(activityChannel);
    };
  }, [projectId, queryClient, toast]);
};