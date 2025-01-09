import { supabase } from "@/integrations/supabase/client";
import type { DeadlinePreference, AssignmentTracking } from "@/types/deadlines";
import type { NotificationMetadata, NotificationType } from "@/types/notifications";
import { handleAssignmentNotification } from "./notificationTriggers";

export class DeadlineService {
  async getUserPreferences(userId: string): Promise<DeadlinePreference | null> {
    const { data, error } = await supabase
      .from('deadline_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching deadline preferences:', error);
      return null;
    }

    return {
      ...data,
      notification_channels: data.notification_channels,
      deadline_statuses: data.deadline_statuses
    };
  }

  async checkDeadlines(assignments: AssignmentTracking[]) {
    for (const assignment of assignments) {
      const prefs = await this.getUserPreferences(assignment.userId);
      if (!prefs) continue;

      await this.processDeadline(assignment, prefs);
    }
  }

  private async processDeadline(
    assignment: AssignmentTracking,
    prefs: DeadlinePreference
  ) {
    const daysRemaining = this.calculateDaysRemaining(assignment.deadlines.due);
    
    if (this.shouldSendWarning(daysRemaining, prefs.warning_days)) {
      await this.sendWarningNotification(assignment, daysRemaining);
    }
    
    if (daysRemaining < 0) {
      await this.sendOverdueNotification(assignment);
    }
  }

  private calculateDaysRemaining(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  }

  private shouldSendWarning(daysRemaining: number, warningDays: number[]): boolean {
    return daysRemaining > 0 && warningDays.includes(daysRemaining);
  }

  private async sendWarningNotification(assignment: AssignmentTracking, daysRemaining: number) {
    await handleAssignmentNotification({
      taskId: assignment.taskId,
      roleType: assignment.roleType,
      userId: assignment.userId,
      status: 'DEADLINE_WARNING'
    }, NotificationType.DEADLINE_WARNING);
  }

  private async sendOverdueNotification(assignment: AssignmentTracking) {
    await handleAssignmentNotification({
      taskId: assignment.taskId,
      roleType: assignment.roleType,
      userId: assignment.userId,
      status: 'DEADLINE_OVERDUE'
    }, NotificationType.DEADLINE_OVERDUE);
  }
}

// Create a singleton instance
export const deadlineService = new DeadlineService();