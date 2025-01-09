import { supabase } from "@/integrations/supabase/client";
import { NotificationType } from "@/types/notifications";
import { handleAssignmentNotification } from "@/services/notificationTriggers";
import { handleDeadline } from "@/utils/deadlineChecker";

// Test data generators
export const createTestTask = async (params: {
  name: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  deadline: Date;
  priority: 'High' | 'Medium' | 'Low';
  languageId: string;
}) => {
  const { data: task, error } = await supabase
    .from('project_tasks')
    .insert({
      name: params.name,
      language_id: params.languageId,
      priority: params.priority,
    })
    .select()
    .single();

  if (error) throw error;

  // Create role assignment
  const { error: assignmentError } = await supabase
    .from('role_assignments')
    .insert({
      task_id: task.id,
      role_type: params.roleType,
      status: 'pending',
      due_date: params.deadline.toISOString(),
    });

  if (assignmentError) throw assignmentError;

  return task;
};

export const setUserPreferences = async (userId: string, preferences: {
  warningDays: number[];
  notificationChannels: ('email' | 'in_app')[];
  deadlineStatuses: ('approaching' | 'overdue')[];
}) => {
  const { error } = await supabase
    .from('deadline_preferences')
    .upsert({
      user_id: userId,
      warning_days: preferences.warningDays,
      notification_channels: preferences.notificationChannels,
      deadline_statuses: preferences.deadlineStatuses,
    });

  if (error) throw error;
};

// Test scenarios
export const runDeadlineTests = async (userId: string) => {
  console.log('Running deadline notification tests...');

  // Test 1: Upcoming deadline (3 days away)
  const upcomingDeadline = new Date();
  upcomingDeadline.setDate(upcomingDeadline.getDate() + 3);
  
  await createTestTask({
    name: 'Test Upcoming Deadline',
    roleType: 'translator',
    deadline: upcomingDeadline,
    priority: 'High',
    languageId: 'test-language-id',
  });

  // Test 2: Passed deadline (2 days ago)
  const passedDeadline = new Date();
  passedDeadline.setDate(passedDeadline.getDate() - 2);
  
  await createTestTask({
    name: 'Test Passed Deadline',
    roleType: 'reviewer',
    deadline: passedDeadline,
    priority: 'Medium',
    languageId: 'test-language-id',
  });

  console.log('Deadline test tasks created');
};

export const runPreferenceTests = async (userId: string) => {
  console.log('Running notification preference tests...');

  // Test different warning thresholds
  await setUserPreferences(userId, {
    warningDays: [1, 3, 7],
    notificationChannels: ['email', 'in_app'],
    deadlineStatuses: ['approaching', 'overdue'],
  });

  // Test email-only preferences
  await setUserPreferences(userId, {
    warningDays: [5],
    notificationChannels: ['email'],
    deadlineStatuses: ['overdue'],
  });

  console.log('Preference tests completed');
};

export const runRoleTests = async (userId: string) => {
  console.log('Running role-specific tests...');

  const roles: ('translator' | 'reviewer' | 'ugc_talent')[] = ['translator', 'reviewer', 'ugc_talent'];
  const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];
  
  // Create tasks for each role with different deadlines
  for (const role of roles) {
    for (const priority of priorities) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 10));
      
      await createTestTask({
        name: `Test ${role} ${priority} Priority`,
        roleType: role,
        deadline,
        priority,
        languageId: 'test-language-id',
      });
    }
  }

  console.log('Role tests completed');
};

// Utility to verify notifications
export const verifyNotifications = async (userId: string) => {
  const { data: notifications, error } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  console.log('Recent notifications:', notifications);
  return notifications;
};