import { handleAssignmentNotification } from "@/services/notificationTriggers";
import { NotificationType, AssignmentData } from "@/types/notifications";

export const handleDeadline = async (assignment: AssignmentData) => {
  const dueDate = new Date(assignment.deadlines.due);
  const now = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const warningThreshold = 3;

  const assignmentData = {
    task_id: assignment.task_id,
    role_type: assignment.role_type,
    user_id: assignment.user_id,
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