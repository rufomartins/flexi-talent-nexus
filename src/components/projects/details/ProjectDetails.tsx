import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectItems } from "./ProjectItems";
import type { Project } from "@/types/project";

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          description,
          status,
          start_date,
          end_date,
          client_id,
          project_manager_id,
          type,
          completion_percentage,
          active_tasks_count,
          upcoming_deadlines_count,
          progress_percentage,
          color_code
        `)
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data as Project;
    },
  });

  if (isLoading) {
    return <div>Loading project details...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectItems projectId={projectId} />
    </div>
  );
}