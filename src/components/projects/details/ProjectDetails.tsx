import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectStats } from "../ProjectStats";
import { ProjectItems } from "./ProjectItems";
import type { Project } from "@/types/project";
import type { ProjectItem, ProjectTask } from "../types";

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
          id,
          name,
          description,
          status,
          type,
          completion_percentage,
          active_tasks_count,
          upcoming_deadlines_count,
          created_at,
          updated_at,
          client:clients (
            id,
            name
          ),
          countries:project_countries (
            id,
            country_name,
            languages:project_languages (
              id,
              language_name
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
        .select(`
          id,
          language_id,
          name,
          script_status,
          review_status,
          talent_status,
          delivery_status,
          priority,
          created_at,
          updated_at,
          language:project_languages!inner (
            id,
            language_name
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform ProjectTask[] to ProjectItem[]
      return (data as ProjectTask[]).map(task => ({
        ...task,
        language: task.language || {
          id: task.language_id,
          language_name: 'Unknown'
        }
      })) as ProjectItem[];
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