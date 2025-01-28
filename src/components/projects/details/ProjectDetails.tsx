import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectItems } from "./ProjectItems";
import { supabase } from "@/integrations/supabase/client";
import { ProjectStats } from "../ProjectStats";
import type { Database } from "@/integrations/supabase/types";

type ProjectScriptStatus = Database["public"]["Enums"]["project_script_status"];
type ProjectReviewStatus = Database["public"]["Enums"]["project_review_status"];
type ProjectTalentStatus = Database["public"]["Enums"]["project_talent_status"];
type ProjectDeliveryStatus = Database["public"]["Enums"]["project_delivery_status"];

interface SimplifiedProject {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  status?: string;
  client?: { 
    name: string 
  };
  created_at: string;
  updated_at: string;
}

interface SimplifiedProjectItem {
  id: string;
  language_id: string;
  name: string;
  script_status: ProjectScriptStatus;
  review_status: ProjectReviewStatus;
  talent_status: ProjectTalentStatus;
  delivery_status: ProjectDeliveryStatus;
  priority: string;
  created_at: string;
}

interface ProjectDetailsProps {
  projectId: string;
  onStatusUpdate: (status: string) => Promise<void>;
  onItemAdd: (item: Omit<SimplifiedProjectItem, 'id' | 'created_at'>) => Promise<void>;
}

export function ProjectDetails({ projectId, onStatusUpdate, onItemAdd }: ProjectDetailsProps) {
  const [project, setProject] = useState<SimplifiedProject | null>(null);
  const [items, setItems] = useState<SimplifiedProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            id,
            name,
            description,
            client_id,
            status,
            created_at,
            updated_at,
            client:clients(name)
          `)
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        const { data: itemsData, error: itemsError } = await supabase
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
            created_at
          `)
          .eq('project_id', projectId);

        if (itemsError) throw itemsError;

        setProject(projectData);
        setItems(itemsData || []);
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const stats = [
    {
      title: "Total Items",
      value: items.length
    },
    {
      title: "In Progress",
      value: items.filter(item => item.script_status === 'In Progress').length
    },
    {
      title: "Completed",
      value: items.filter(item => item.delivery_status === 'Delivered').length
    }
  ];

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        onEdit={() => {}}
        onStatusChange={onStatusUpdate}
      />
      
      <ProjectStats stats={stats} />
      
      <ProjectItems
        projectId={projectId}
        items={items}
        onItemStatusUpdate={async (itemId, updates) => {
          try {
            const { error } = await supabase
              .from('project_tasks')
              .update(updates)
              .eq('id', itemId);

            if (error) throw error;

            toast({
              title: "Status updated",
              description: "Item status has been updated successfully",
            });
          } catch (error) {
            console.error('Error updating item status:', error);
            toast({
              title: "Error",
              description: "Failed to update item status",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}