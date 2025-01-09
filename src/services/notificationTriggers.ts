import { supabase } from "@/integrations/supabase/client";
import type { NotificationType, NotificationMetadata, AssignmentData, Json } from "@/types/notifications";

export const handleAssignmentNotification = async (
  assignmentData: AssignmentData,
  type: NotificationType
) => {
  const metadata: NotificationMetadata = {
    task_id: assignmentData.task_id,
    role_type: assignmentData.role_type,
    content: generateNotificationContent(assignmentData, type)
  };

  const notificationData = {
    type,
    user_id: assignmentData.user_id,
    status: 'pending' as const,
    metadata: JSON.parse(JSON.stringify(metadata)) as Json
  };

  const { error } = await supabase
    .from('notification_queue')
    .insert(notificationData);

  if (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
};

function generateNotificationContent(
  assignmentData: AssignmentData,
  type: NotificationType
): NotificationMetadata['content'] {
  const baseUrl = `/projects/tasks/${assignmentData.task_id}`;

  switch (type) {
    case NotificationType.NEW_ASSIGNMENT:
      return {
        title: 'New Assignment',
        message: `You have been assigned a new ${assignmentData.role_type} task`,
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    case NotificationType.STATUS_CHANGE:
      return {
        title: 'Status Updated',
        message: `Task status has been updated to ${assignmentData.status}`,
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    case NotificationType.DEADLINE_WARNING:
      return {
        title: 'Deadline Approaching',
        message: 'Task deadline is approaching',
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    case NotificationType.DEADLINE_OVERDUE:
      return {
        title: 'Deadline Missed',
        message: 'Task deadline has passed',
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    default:
      return {
        title: 'Notification',
        message: 'You have a new notification',
        action: {
          type: 'link',
          url: baseUrl
        }
      };
  }
}
