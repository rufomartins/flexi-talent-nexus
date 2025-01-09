import { differenceInDays } from "date-fns"
import { handleAssignmentNotification } from "@/services/notificationTriggers"

interface Assignment {
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  userId: string;
  deadlines: {
    start: string;
    due: string;
  };
}

export function checkDeadlines(assignments: Assignment[]) {
  const now = new Date();
  
  assignments.forEach(assignment => {
    if (!assignment.deadlines?.due) return;
    
    const deadline = new Date(assignment.deadlines.due);
    const daysDiff = differenceInDays(deadline, now);
    
    if (daysDiff <= 2 && daysDiff > 0) {
      handleAssignmentNotification(
        assignment,
        'DEADLINE_APPROACHING'
      );
    } else if (daysDiff < 0) {
      handleAssignmentNotification(
        assignment,
        'DEADLINE_MISSED'
      );
    }
  });
}