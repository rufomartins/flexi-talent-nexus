import { handleAssignmentNotification } from "@/services/notificationTriggers";
import { NotificationType } from "@/types/notifications";
import type { AssignmentTracking } from "@/types/deadlines";

const createMetadata = (assignment: AssignmentTracking) => ({
  task_id: assignment.taskId,
  role_type: assignment.roleType,
  content: {
    title: 'Deadline Update',
    message: `Task deadline update for ${assignment.roleType}`,
    action: {
      type: 'link',
      url: `/projects/tasks/${assignment.taskId}`
    }
  }
});

export const handleDeadline = async (assignment: AssignmentTracking) => {
  const dueDate = new Date(assignment.deadlines.due);
  const now = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const warningThreshold = 3; // Can be configurable

  if (daysRemaining <= warningThreshold && daysRemaining > 0) {
    await handleAssignmentNotification(
      createMetadata(assignment),
      assignment.userId,
      NotificationType.DEADLINE_WARNING
    );
  } else if (daysRemaining < 0) {
    await handleAssignmentNotification(
      createMetadata(assignment),
      assignment.userId,
      NotificationType.DEADLINE_OVERDUE
    );
  }
};