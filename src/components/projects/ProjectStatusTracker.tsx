import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectStatus {
  id: string;
  progress: number;
  status: string;
}

export function ProjectStatusTracker({ projectId }: { projectId: string }) {
  const { data: projectStatus } = useQuery({
    queryKey: ['project-status', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, completion_percentage, status')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        progress: data.completion_percentage || 0,
        status: data.status || 'pending'
      } as ProjectStatus;
    }
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Status</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${projectStatus?.progress || 0}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {projectStatus?.progress || 0}%
        </span>
      </div>
      <div className="text-sm text-muted-foreground">
        Status: {projectStatus?.status || 'Pending'}
      </div>
    </div>
  );
}