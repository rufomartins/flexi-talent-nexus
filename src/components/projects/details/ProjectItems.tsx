import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProjectItem } from "../types";
import { ItemList } from "./ItemList";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectItemsProps {
  projectId: string;
  items: ProjectItem[];
  onItemStatusUpdate: (itemId: string, updates: Partial<ProjectItem>) => Promise<void>;
}

export function ProjectItems({ projectId, items, onItemStatusUpdate }: ProjectItemsProps) {
  const { toast } = useToast();

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('project-items')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Change received!', payload);
          // Handle the change - you'll need to implement the handler
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const handleItemClick = (itemId: string) => {
    // Implement item click handler
    console.log('Item clicked:', itemId);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Project Items</h2>
        <Select defaultValue="script_status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="script_status">Group by Script Status</SelectItem>
            <SelectItem value="review_status">Group by Review Status</SelectItem>
            <SelectItem value="talent_status">Group by Talent Status</SelectItem>
            <SelectItem value="delivery_status">Group by Delivery Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ItemList
        items={items}
        groupBy="script_status"
        onItemClick={handleItemClick}
      />
    </Card>
  );
}