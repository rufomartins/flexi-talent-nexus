import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectItems } from "./ProjectItems";
import type { Project, ProjectStatus } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const { toast } = useToast();
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
          color_code,
          created_at,
          updated_at,
          client:clients(name)
        `)
        .eq("id", projectId)
        .single();

      if (error) throw error;

      // Transform the data to match the Project type
      const transformedProject: Project = {
        ...data,
        countries: [], // Initialize with empty array since we'll fetch this separately if needed
        created_at: data.created_at,
        updated_at: data.updated_at,
        status: (data.status || 'active') as ProjectStatus,
      };

      return transformedProject;
    },
  });

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit project:", projectId);
  };

  const handleStatusChange = async (newStatus: Project['status']) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Project status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading project details...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <ProjectHeader 
        project={project} 
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />
      <ProjectItems 
        projectId={projectId}
        items={[]} // Initialize with empty array
        onItemStatusUpdate={async (itemId, updates) => {
          // Implement status update logic
          console.log("Update item status:", itemId, updates);
        }}
      />
    </div>
  );
}