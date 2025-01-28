import { useQuery } from "@tanstack/react-query";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectItems } from "./ProjectItems";
import { supabase } from "@/integrations/supabase/client";
import { ProjectStats } from "../ProjectStats";
import type { Project, ProjectItem } from "../types";

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
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data as Project;
    },
  });

  const { data: items = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['project-items', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        ...item,
        script_status: item.script_status || 'Pending',
        review_status: item.review_status || 'Internal Review',
        talent_status: item.talent_status || 'Booked',
        delivery_status: item.delivery_status || 'Pending'
      })) as ProjectItem[];
    },
  });

  if (isLoadingProject || isLoadingItems) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <ProjectStats project={project} />
      <ProjectItems items={items} />
    </div>
  );
};