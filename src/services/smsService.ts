import { supabase } from '@/integrations/supabase/client';
import type { NotificationType } from '@/types/notifications';

export const smsService = {
  async sendSMS(phoneNumber: string, message: string, type: NotificationType, metadata?: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        to: phoneNumber,
        message,
        notificationType: type,
        recipientId: user.id,
        metadata
      }
    });

    if (error) throw error;
    return data;
  },

  async updateSMSPreferences(enabled: boolean, types: NotificationType[]) {
    const { error } = await supabase
      .from('users')
      .update({
        sms_notifications_enabled: enabled,
        sms_notification_types: types
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
  },

  async verifyPhoneNumber(phoneNumber: string) {
    // In a real implementation, this would send a verification code
    // For now, we'll just mark it as verified
    const { error } = await supabase
      .from('users')
      .update({
        mobile_phone: phoneNumber,
        phone_number_verified: true
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
  }
};