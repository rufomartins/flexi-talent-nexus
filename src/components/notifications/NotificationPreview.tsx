import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { NotificationType } from "@/types/notifications";
import { supabase } from "@/integrations/supabase/client";
import { NotificationPreviewHeader } from "./preview/NotificationPreviewHeader";
import { NotificationTypeList } from "./preview/NotificationTypeList";
import { RoleSelector } from "./preview/RoleSelector";
import { DeadlinePreview } from "./preview/DeadlinePreview";
import { Button } from "../ui/button";

interface NotificationPreviewProps {
  types: readonly NotificationType[];
  roles: readonly ('translator' | 'reviewer' | 'ugc_talent')[];
  deadlines: {
    approaching: readonly number[];
    overdue: readonly number[];
  };
}

export function NotificationPreview({ types, roles, deadlines }: NotificationPreviewProps) {
  const [loading, setLoading] = useState(false);

  const generateSampleNotifications = async () => {
    setLoading(true);
    try {
      // Generate notifications for each type
      for (const type of types) {
        for (const role of roles) {
          const metadata = {
            task_id: crypto.randomUUID(),
            role_type: role,
            content: {
              title: `${type} Notification`,
              message: `Test notification for ${role} - ${type}`,
              action: {
                type: 'link',
                url: `/projects/tasks/test-${crypto.randomUUID()}`
              }
            }
          };

          await supabase
            .from('notification_queue')
            .insert({
              type,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              status: 'pending',
              metadata
            });
        }
      }
      toast.success('Sample notifications generated');
    } catch (error) {
      console.error('Error generating notifications:', error);
      toast.error('Failed to generate notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = async (type: NotificationType) => {
    setLoading(true);
    try {
      const metadata = {
        task_id: crypto.randomUUID(),
        role_type: roles[0],
        content: {
          title: `${type} Notification`,
          message: `Test notification for ${type}`,
          action: {
            type: 'link',
            url: `/projects/tasks/test-${crypto.randomUUID()}`
          }
        }
      };

      await supabase
        .from('notification_queue')
        .insert({
          type,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending',
          metadata
        });

      toast.success(`Generated ${type} notification`);
    } catch (error) {
      console.error('Error generating notification:', error);
      toast.error('Failed to generate notification');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: string) => {
    setLoading(true);
    try {
      const metadata = {
        task_id: crypto.randomUUID(),
        role_type: role,
        content: {
          title: 'Role Notification',
          message: `Test notification for ${role}`,
          action: {
            type: 'link',
            url: `/projects/tasks/test-${crypto.randomUUID()}`
          }
        }
      };

      await supabase
        .from('notification_queue')
        .insert({
          type: NotificationType.NEW_ASSIGNMENT,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending',
          metadata
        });

      toast.success(`Generated notification for ${role}`);
    } catch (error) {
      console.error('Error generating notification:', error);
      toast.error('Failed to generate notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeadlineSelect = async (days: number, type: 'approaching' | 'overdue') => {
    setLoading(true);
    try {
      const metadata = {
        task_id: crypto.randomUUID(),
        role_type: roles[0],
        content: {
          title: type === 'approaching' ? 'Deadline Approaching' : 'Deadline Overdue',
          message: type === 'approaching' 
            ? `Task due in ${days} days`
            : `Task is ${days} days overdue`,
          action: {
            type: 'link',
            url: `/projects/tasks/test-${crypto.randomUUID()}`
          }
        }
      };

      await supabase
        .from('notification_queue')
        .insert({
          type: type === 'approaching' 
            ? NotificationType.DEADLINE_APPROACHING 
            : NotificationType.DEADLINE_OVERDUE,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending',
          metadata
        });

      toast.success('Deadline notification generated');
    } catch (error) {
      console.error('Error generating deadline notification:', error);
      toast.error('Failed to generate notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <NotificationPreviewHeader title="Notification Preview" />
      
      <Button 
        onClick={generateSampleNotifications}
        disabled={loading}
        className="w-full"
      >
        Generate Sample Notifications
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NotificationTypeList types={types} onSelect={handleTypeSelect} />
        <RoleSelector roles={roles} onSelectRole={handleRoleSelect} />
      </div>

      <DeadlinePreview 
        deadlines={deadlines}
        onSelectDeadline={handleDeadlineSelect} 
      />
    </Card>
  );
}