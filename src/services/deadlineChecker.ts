import { supabase } from "@/integrations/supabase/client";
import { handleAssignmentNotification } from "./notificationTriggers";

export interface DeadlinePreferences {
  warningDays: number[];
  notificationTypes: ('approaching' | 'overdue')[];
}

export interface DeadlineCheck {
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  deadline: string;
  userId: string;
}

export async function getUserDeadlinePreferences(userId: string): Promise<DeadlinePreferences> {
  const { data, error } = await supabase
    .from('deadline_preferences')
    .select('warning_days, notification_types')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching deadline preferences:', error);
    // Return default preferences if none found
    return {
      warningDays: [3, 1],
      notificationTypes: ['approaching', 'overdue']
    };
  }

  return {
    warningDays: data.warning_days,
    notificationTypes: data.notification_types
  };
}

export async function updateDeadlinePreferences(
  userId: string,
  preferences: DeadlinePreferences
): Promise<void> {
  const { error } = await supabase
    .from('deadline_preferences')
    .upsert({
      user_id: userId,
      warning_days: preferences.warningDays,
      notification_types: preferences.notificationTypes,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error updating deadline preferences:', error);
    throw error;
  }
}

export async function checkDeadline(check: DeadlineCheck): Promise<void> {
  const preferences = await getUserDeadlinePreferences(check.userId);
  const deadline = new Date(check.deadline);
  const now = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));

  // Check for approaching deadline
  if (daysRemaining > 0 && preferences.notificationTypes.includes('approaching')) {
    if (preferences.warningDays.includes(daysRemaining)) {
      await handleAssignmentNotification({
        taskId: check.taskId,
        roleType: check.roleType,
        userId: check.userId,
        status: 'DEADLINE_APPROACHING'
      }, 'DEADLINE_WARNING');
    }
  }
  // Check for overdue
  else if (daysRemaining < 0 && preferences.notificationTypes.includes('overdue')) {
    await handleAssignmentNotification({
      taskId: check.taskId,
      roleType: check.roleType,
      userId: check.userId,
      status: 'DEADLINE_MISSED'
    }, 'DEADLINE_OVERDUE');
  }
}

export async function checkAllDeadlines(): Promise<void> {
  const { data: assignments, error } = await supabase
    .from('role_assignments')
    .select(`
      id,
      task_id,
      role_type,
      user_id,
      due_date
    `)
    .not('due_date', 'is', null);

  if (error) {
    console.error('Error fetching assignments:', error);
    return;
  }

  for (const assignment of assignments) {
    await checkDeadline({
      taskId: assignment.task_id,
      roleType: assignment.role_type as 'translator' | 'reviewer' | 'ugc_talent',
      deadline: assignment.due_date,
      userId: assignment.user_id
    });
  }
}