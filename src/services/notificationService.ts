import { supabase } from '@/integrations/supabase/client';
import type { TalentNotification, NotificationPreferences } from '@/types/notifications';
import type { Database } from '@/integrations/supabase/types';

type NotificationType = Database['public']['Enums']['notification_type'];

export const notificationService = {
  async createNotification(notification: Omit<TalentNotification, 'id' | 'created_at' | 'read'>) {
    const { data, error } = await supabase
      .from('talent_notifications')
      .insert({
        talent_id: notification.talent_id,
        type: notification.type as NotificationType,
        title: notification.title,
        message: notification.message,
        metadata: notification.metadata || {},
        action_url: notification.action_url,
        read: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('talent_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async getUnreadCount(talentId: string) {
    const { count, error } = await supabase
      .from('talent_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('talent_id', talentId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  async getUserPreferences(talentId: string) {
    const { data, error } = await supabase
      .from('talent_notification_preferences')
      .select('*')
      .eq('talent_id', talentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  async updateUserPreferences(preferences: NotificationPreferences) {
    const { data, error } = await supabase
      .from('talent_notification_preferences')
      .upsert({
        talent_id: preferences.talent_id,
        email_enabled: preferences.email_enabled,
        in_app_enabled: preferences.in_app_enabled,
        types: preferences.types as NotificationType[],
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};