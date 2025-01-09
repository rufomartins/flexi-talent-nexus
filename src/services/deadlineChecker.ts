import { supabase } from "@/integrations/supabase/client";
import type { DeadlinePreference, NotificationChannel, DeadlineStatus } from "@/types/notifications";

export const getUserPreferences = async (userId: string): Promise<DeadlinePreference | null> => {
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
    notification_channels: data.notification_channels.map(c => c as NotificationChannel),
    deadline_statuses: data.deadline_statuses.map(s => s as DeadlineStatus)
  };
};