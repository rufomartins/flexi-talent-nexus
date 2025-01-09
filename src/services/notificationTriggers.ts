import { supabase } from "@/integrations/supabase/client";
import { NotificationType, NotificationMetadata, AssignmentData } from "@/types/notifications";

export const handleAssignmentNotification = async (
  assignmentData: AssignmentData,
  type: NotificationType
) => {
  const metadata: NotificationMetadata = {
    task_id: assignmentData.task_id,
    role_type: assignmentData.role_type,
    content: {
      title: 'Assignment Update',
      message: `Assignment status updated to ${assignmentData.status}`,
      action: {
        type: 'link',
        url: `/projects/tasks/${assignmentData.task_id}`
      }
    }
  };

  const notificationData = {
    type,
    user_id: assignmentData.user_id,
    status: 'pending' as const,
    metadata: JSON.parse(JSON.stringify(metadata))
  };

  const { error } = await supabase
    .from('notification_queue')
    .insert(notificationData);

  if (error) throw error;
};