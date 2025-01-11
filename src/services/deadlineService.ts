import { supabase } from "@/integrations/supabase/client";
import type { DeadlinePreference, NotificationMetadata, NotificationType, NotificationChannel, DeadlineStatus } from "@/types/notifications";
import type { Database } from '@/integrations/supabase/types';

type Json = Database['public']['Tables']['notification_queue']['Insert']['metadata'];

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
      id: data.id,
      user_id: data.user_id,
      notification_channels: data.notification_channels.map(c => c as NotificationChannel),
      deadline_statuses: data.deadline_statuses.map(s => s as DeadlineStatus),
      warning_days: data.warning_days || [],
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
}