import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectMetrics } from "./ProjectMetrics";
import { useToast } from "@/hooks/use-toast";

interface ProjectDashboardProps {
  onCreateProject: () => void;
  onProjectSelect: (projectId: string) => void;
}

export function ProjectDashboard({ onCreateProject, onProjectSelect }: ProjectDashboardProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    clientId: "",
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", filters],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select(`
          *,
          client:clients(name),
          project_manager:users(full_name),
          project_countries(
            id,
            country_name,
            project_languages(
              id,
              language_name,
              project_tasks(*)
            )
          )
        `);

      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      if (filters.clientId) {
        query = query.eq("client_id", filters.clientId);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading projects",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button onClick={onCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <ProjectMetrics projects={projects || []} />
      
      <ProjectFilters
        filters={filters}
        onChange={setFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectSelect(project.id)}
          />
        ))}
      </div>
    </div>
  );
}