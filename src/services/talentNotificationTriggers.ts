import { supabase } from "@/integrations/supabase/client";
import type { TalentNotificationType } from "@/types/notifications";
import type { Database } from '@/integrations/supabase/types';
import { notify } from "@/utils/notifications";

type Json = Database['public']['Tables']['talent_notifications']['Insert']['metadata'];

interface NotificationData {
  talent_id: string;
  type: TalentNotificationType;
  title: string;
  message: string;
  metadata?: Json;
  action_url?: string;
}

const createTalentNotification = async (data: NotificationData) => {
  try {
    const { error } = await supabase
      .from('talent_notifications')
      .insert({
        ...data,
        read: false
      } as Database['public']['Tables']['talent_notifications']['Insert']);

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  } catch (err) {
    console.error('Failed to create notification:', err);
    notify.error('Failed to send notification');
  }
};

export const talentNotificationTriggers = {
  // Status changes
  onStatusChange: async (talentId: string, oldStatus: string, newStatus: string) => {
    await createTalentNotification({
      talent_id: talentId,
      type: 'STATUS_CHANGE',
      title: 'Status Updated',
      message: `Your status has been updated from ${oldStatus} to ${newStatus}`,
      metadata: { oldStatus, newStatus }
    });
  },

  // Assignment updates
  onAssignmentUpdate: async (talentId: string, projectId: string, status: string) => {
    await createTalentNotification({
      talent_id: talentId,
      type: 'ASSIGNMENT_UPDATE',
      title: 'New Assignment Update',
      message: `Your assignment status has been updated to ${status}`,
      metadata: { projectId, status }
    });
  },

  // Profile updates
  onProfileUpdate: async (talentId: string, updatedFields: string[]) => {
    await createTalentNotification({
      talent_id: talentId,
      type: 'PROFILE_UPDATE',
      title: 'Profile Updated',
      message: 'Your profile has been updated',
      metadata: { updatedFields }
    });
  },

  // Duo partner changes
  onDuoPartnerChange: async (talentId: string, partnerId: string, action: 'added' | 'removed') => {
    await createTalentNotification({
      talent_id: talentId,
      type: 'DUO_PARTNER_CHANGE',
      title: 'Duo Partner Update',
      message: `A duo partner has been ${action}`,
      metadata: { partnerId, action }
    });
  }
};