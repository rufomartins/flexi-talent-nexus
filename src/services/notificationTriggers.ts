import type { NotificationMetadata } from "@/types/notifications";
import { supabase } from "@/integrations/supabase/client";
import { NotificationType } from "@/types/notifications";

export const triggerTypes = {
  NEW_ASSIGNMENT: NotificationType.NEW_ASSIGNMENT,
  STATUS_CHANGE: NotificationType.STATUS_CHANGE,
  DEADLINE_WARNING: NotificationType.DEADLINE_WARNING,
  DEADLINE_OVERDUE: NotificationType.DEADLINE_OVERDUE,
  ROLE_REASSIGNMENT: NotificationType.ROLE_REASSIGNMENT
} as const;

export type TriggerType = keyof typeof triggerTypes;

interface AssignmentData {
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  userId: string;
  status?: string;
}

function generateNotificationContent(
  assignmentData: AssignmentData,
  triggerType: NotificationType
): NotificationMetadata['content'] {
  const baseUrl = `/projects/tasks/${assignmentData.taskId}`;

  switch (triggerType) {
    case NotificationType.NEW_ASSIGNMENT:
      return {
        title: 'New Assignment',
        message: `You have been assigned a new ${assignmentData.roleType} task`,
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
    case NotificationType.ROLE_REASSIGNMENT:
      return {
        title: 'Role Reassigned',
        message: `You have been assigned as the new ${assignmentData.roleType}`,
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

export async function handleAssignmentNotification(
  assignmentData: AssignmentData,
  triggerType: NotificationType
) {
  const notification: NotificationMetadata = {
    task_id: assignmentData.taskId,
    role_type: assignmentData.roleType,
    content: generateNotificationContent(assignmentData, triggerType)
  };

  const { error } = await supabase
    .from('notification_queue')
    .insert({
      user_id: assignmentData.userId,
      type: triggerType,
      status: 'pending',
      metadata: notification as unknown as Json
    });

  if (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}