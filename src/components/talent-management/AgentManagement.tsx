import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { canViewAgents, canManageAgents } from "@/utils/permissions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type DatabaseUser = Database["public"]["Tables"]["users"]["Row"];

interface AgentManagementProps {
  currentUser: DatabaseUser;
}

export const AgentManagement: React.FC<AgentManagementProps> = ({ currentUser }) => {
  const isVisible = canViewAgents(currentUser);
  const canManage = canManageAgents(currentUser);
  
  const { data: agents, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          status,
          created_at,
          agent_talent_relationships (
            talent_id,
            talent:talent_id (
              first_name,
              last_name
            )
          )
        `)
        .eq("role", "agent");

      if (error) {
        toast.error("Failed to load agents");
        throw error;
      }

      return data;
    },
    enabled: isVisible
  });

  if (!isVisible) return null;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Management</h2>
        {canManage && (
          <Button onClick={() => toast.info("Add Agent functionality coming soon")}>
            Add Agent
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents?.map((agent) => (
          <Card key={agent.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">
                {agent.first_name} {agent.last_name}
              </h3>
              <p className="text-sm text-gray-500">{agent.email}</p>
              <p className="text-sm">
                Status: <span className="capitalize">{agent.status}</span>
              </p>
              <p className="text-sm">
                Talents: {agent.agent_talent_relationships?.length || 0}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};