import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectStats } from "../ProjectStats";
import { ProjectItems } from "./ProjectItems";
import type { Project, ProjectTask } from "@/types/project";

interface ProjectDetailsProps {
  projectId: string;
}

export const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients (
            id,
            name
          ),
          countries (
            id,
            country_name,
            languages (
              id,
              language_name,
              tasks: project_tasks (*)
            )
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data as Project;
    },
  });

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProjectTask[];
    },
  });

  if (isLoadingProject || isLoadingTasks) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} onEdit={() => {}} onStatusChange={async () => {}} />
      <ProjectStats stats={[]} />
      <ProjectItems items={tasks} projectId={projectId} onItemStatusUpdate={async () => {}} />
    </div>
  );
};