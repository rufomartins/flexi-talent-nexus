import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/types/notifications";
import { NotificationType, type NotificationMetadata } from "@/types/notifications";
import type { AssignmentTracking, DeadlinePreference } from "@/types/deadlines";

export const createNotification = async (
  metadata: NotificationMetadata, 
  userId: string,
  type: NotificationType
) => {
  const notificationData = {
    type,
    user_id: userId,
    status: 'pending' as const,
    metadata: JSON.parse(JSON.stringify(metadata)) as Json
  };

  const { data, error } = await supabase
    .from('notification_queue')
    .insert(notificationData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

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
    notification_types: data.notification_types as DeadlineStatus[]
  };
};