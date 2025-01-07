import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";

export default function Projects() {
  const { user } = useAuth();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients (
            name
          ),
          project_manager:project_manager_id (
            full_name
          )
        `);
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-red-500">
          Error loading projects. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>

      {!projects?.length ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-card p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Client: {project.clients?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Project Manager: {project.project_manager?.full_name || 'N/A'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status || 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}