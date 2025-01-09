import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AssignmentHistory } from "./AssignmentHistory";
import { AssignmentStatus } from "./AssignmentStatus";
import { AssignmentDeadlines } from "./AssignmentDeadlines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notify } from "@/utils/notifications";

interface AssignmentTrackerProps {
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
}

export function AssignmentTracker({ taskId, roleType }: AssignmentTrackerProps) {
  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', taskId, roleType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_assignments')
        .select(`
          *,
          user:users(id, full_name),
          history:assignment_history(*)
        `)
        .eq('task_id', taskId)
        .eq('role_type', roleType)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleStatusUpdate = async (newStatus: string) => {
    const { error } = await supabase
      .from('role_assignments')
      .update({ status: newStatus, last_updated: new Date().toISOString() })
      .eq('id', assignment?.id);

    if (error) {
      notify.error('Failed to update status');
      return;
    }

    notify.success('Status updated successfully');
  };

  if (isLoading) {
    return <div>Loading assignment details...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {roleType.charAt(0).toUpperCase() + roleType.slice(1)} Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status">
          <TabsList>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <AssignmentStatus
              currentStatus={assignment?.status}
              onStatusUpdate={handleStatusUpdate}
              roleType={roleType}
            />
          </TabsContent>

          <TabsContent value="history">
            <AssignmentHistory
              history={assignment?.history || []}
              roleType={roleType}
            />
          </TabsContent>

          <TabsContent value="deadlines">
            <AssignmentDeadlines
              assignmentId={assignment?.id}
              startDate={assignment?.start_date}
              dueDate={assignment?.due_date}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}