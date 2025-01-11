import { handleAssignmentNotification } from "@/services/notificationTriggers";
import { NotificationType } from "@/types/notifications";
import type { AssignmentTracking } from "@/types/deadlines";

export const handleDeadline = async (assignment: AssignmentTracking) => {
  const dueDate = new Date(assignment.deadlines.due);
  const now = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const warningThreshold = 3; // Can be configurable

  const assignmentData = {
    task_id: assignment.taskId,
    role_type: assignment.roleType,
    user_id: assignment.userId,
    status: daysRemaining <= 0 ? 'overdue' : 'warning'
  };

  if (daysRemaining <= warningThreshold && daysRemaining > 0) {
    await handleAssignmentNotification(
      assignmentData,
      NotificationType.DEADLINE_WARNING
    );
  } else if (daysRemaining < 0) {
    await handleAssignmentNotification(
      assignmentData,
      NotificationType.DEADLINE_OVERDUE
    );
  }
};