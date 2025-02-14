
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectTeam } from "./ProjectTeam";
import { ProjectDocuments } from "./ProjectDocuments";
import { ProjectSettings } from "./ProjectSettings";
import type { Project } from "@/types/project";

export function ProjectDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:clients(id, name),
          team:project_team(
            id,
            role,
            user:users(
              id,
              full_name,
              email,
              avatar_url
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return transformProjectData(data);
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("project-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("Project updated:", payload);
          queryClient.invalidateQueries({ queryKey: ["project", id] });
          toast({
            title: "Project Updated",
            description: "The project details have been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient, toast]);

  const transformProjectData = (data: any): Project => {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      start_date: data.start_date,
      end_date: data.end_date,
      client_id: data.client_id,
      project_manager_id: data.project_manager_id,
      client: data.client ? {
        id: data.client.id,
        name: data.client.name
      } : undefined,
      project_manager: data.project_manager ? {
        full_name: data.project_manager.full_name
      } : undefined,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  };

  if (isLoading) {
    return <div>Loading project details...</div>;
  }

  if (error) {
    return <div>Error loading project: {error.message}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
        <p className="text-sm text-muted-foreground">
          Project ID: {project.id}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ProjectOverview project={project} />
        </TabsContent>
        <TabsContent value="team">
          <ProjectTeam project={project} />
        </TabsContent>
        <TabsContent value="documents">
          <ProjectDocuments project={project} />
        </TabsContent>
        <TabsContent value="settings">
          <ProjectSettings project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
