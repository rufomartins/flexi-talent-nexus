import { supabase } from "@/integrations/supabase/client"
import type { NotificationMetadata } from "@/types/notifications"
import type { Task } from "@/components/projects/types"

export const triggerTypes = {
  NEW_ASSIGNMENT: 'new_assignment',
  STATUS_CHANGE: 'status_change',
  DEADLINE_APPROACHING: 'deadline_approaching',
  DEADLINE_MISSED: 'deadline_missed',
  ROLE_REASSIGNMENT: 'role_reassignment'
} as const;

type TriggerType = keyof typeof triggerTypes;

interface AssignmentData {
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  userId: string;
  status?: string;
  deadlines?: {
    start: string;
    due: string;
  };
}

function generateNotificationContent(
  assignmentData: AssignmentData,
  triggerType: TriggerType
): NotificationMetadata['content'] {
  const baseUrl = `/projects/tasks/${assignmentData.taskId}`;
  
  switch (triggerType) {
    case 'NEW_ASSIGNMENT':
      return {
        title: 'New Assignment',
        message: `You have been assigned a new ${assignmentData.roleType} task`,
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    case 'STATUS_CHANGE':
      return {
        title: 'Status Updated',
        message: `Task status has been updated to ${assignmentData.status}`,
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    case 'DEADLINE_APPROACHING':
      return {
        title: 'Deadline Approaching',
        message: 'Task deadline is approaching in 2 days',
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    case 'DEADLINE_MISSED':
      return {
        title: 'Deadline Missed',
        message: 'Task deadline has passed',
        action: {
          type: 'link',
          url: baseUrl
        }
      };
    case 'ROLE_REASSIGNMENT':
      return {
        title: 'Role Reassigned',
        message: `You have been assigned as the new ${assignmentData.roleType}`,
        action: {
          type: 'link',
          url: baseUrl
        }
      };
  }
}

export async function handleAssignmentNotification(
  assignmentData: AssignmentData,
  triggerType: TriggerType
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
      metadata: notification
    });

  if (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}