import { supabase } from "@/integrations/supabase/client";
import type { DeadlinePreference, NotificationMetadata, NotificationType, NotificationChannel, DeadlineStatus, Json } from "@/types/notifications";

export class DeadlineService {
  async createNotification(
    metadata: NotificationMetadata,
    userId: string,
    type: NotificationType
  ) {
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
  }

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
      notification_channels: data.notification_channels.map(c => c as NotificationChannel),
      deadline_statuses: data.deadline_statuses.map(s => s as DeadlineStatus)
    };
  }
}