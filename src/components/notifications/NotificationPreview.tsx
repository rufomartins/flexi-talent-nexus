import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { NotificationType } from "@/types/notifications";
import { supabase } from "@/integrations/supabase/client";

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

  const testDeadlineNotifications = async () => {
    setLoading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('No user logged in');

      // Test approaching deadlines
      for (const daysUntil of deadlines.approaching) {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + daysUntil);
        
        await supabase
          .from('notification_queue')
          .insert({
            type: NotificationType.DEADLINE_APPROACHING,
            user_id: userId,
            status: 'pending',
            metadata: {
              task_id: crypto.randomUUID(),
              role_type: roles[0],
              content: {
                title: 'Deadline Approaching',
                message: `Task due in ${daysUntil} days`,
                action: {
                  type: 'link',
                  url: `/projects/tasks/test-${crypto.randomUUID()}`
                }
              }
            }
          });
      }

      // Test overdue deadlines
      for (const daysOver of deadlines.overdue) {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() - daysOver);
        
        await supabase
          .from('notification_queue')
          .insert({
            type: NotificationType.DEADLINE_OVERDUE,
            user_id: userId,
            status: 'pending',
            metadata: {
              task_id: crypto.randomUUID(),
              role_type: roles[0],
              content: {
                title: 'Deadline Overdue',
                message: `Task is ${daysOver} days overdue`,
                action: {
                  type: 'link',
                  url: `/projects/tasks/test-${crypto.randomUUID()}`
                }
              }
            }
          });
      }

      toast.success('Deadline notifications generated');
    } catch (error) {
      console.error('Error generating deadline notifications:', error);
      toast.error('Failed to generate deadline notifications');
    } finally {
      setLoading(false);
    }
  };

  const testStatusNotifications = async () => {
    setLoading(true);
    try {
      const statuses = ['pending', 'in_progress', 'completed', 'rejected'];
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('No user logged in');

      for (const status of statuses) {
        await supabase
          .from('notification_queue')
          .insert({
            type: NotificationType.STATUS_CHANGE,
            user_id: userId,
            status: 'pending',
            metadata: {
              task_id: crypto.randomUUID(),
              role_type: roles[0],
              content: {
                title: 'Status Update',
                message: `Task status changed to ${status}`,
                action: {
                  type: 'link',
                  url: `/projects/tasks/test-${crypto.randomUUID()}`
                }
              }
            }
          });
      }

      toast.success('Status notifications generated');
    } catch (error) {
      console.error('Error generating status notifications:', error);
      toast.error('Failed to generate status notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Notification Preview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={generateSampleNotifications}
          disabled={loading}
          className="w-full"
        >
          Generate Sample Notifications
        </Button>

        <Button 
          onClick={testDeadlineNotifications}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          Test Deadline Notifications
        </Button>

        <Button 
          onClick={testStatusNotifications}
          disabled={loading}
          variant="secondary"
          className="w-full"
        >
          Test Status Notifications
        </Button>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Preview system for testing notifications with:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Different notification types: {Array.from(types).join(', ')}</li>
          <li>Role combinations: {Array.from(roles).join(', ')}</li>
          <li>Approaching deadlines: {Array.from(deadlines.approaching).join(', ')} days before</li>
          <li>Overdue deadlines: {Array.from(deadlines.overdue).join(', ')} days after</li>
        </ul>
      </div>
    </Card>
  );
}