import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { NotificationType } from "@/types/notifications";
import { notify } from "@/utils/notifications";

type Json = Database['public']['Tables']['talent_notifications']['Insert']['metadata'];

interface NotificationData {
  talent_id: string;
  type: keyof typeof NotificationType;
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
  onStatusChange: async (talentId: string, oldStatus: string, newStatus: string) => {
    await createTalentNotification({
      talent_id: talentId,
      type: NotificationType.STATUS_CHANGE,
      title: 'Status Updated',
      message: `Your status has been updated from ${oldStatus} to ${newStatus}`,
      metadata: { oldStatus, newStatus }
    });
  },

  onAssignmentUpdate: async (talentId: string, projectId: string, status: string) => {
    await createTalentNotification({
      talent_id: talentId,
      type: NotificationType.ASSIGNMENT_UPDATE,
      title: 'New Assignment Update',
      message: `Your assignment status has been updated to ${status}`,
      metadata: { projectId, status }
    });
  },

  onProfileUpdate: async (talentId: string, updatedFields: string[]) => {
    await createTalentNotification({
      talent_id: talentId,
      type: NotificationType.PROFILE_UPDATE,
      title: 'Profile Updated',
      message: 'Your profile has been updated',
      metadata: { updatedFields }
    });
  },

  onDuoPartnerChange: async (talentId: string, partnerId: string, action: 'added' | 'removed') => {
    await createTalentNotification({
      talent_id: talentId,
      type: NotificationType.DUO_PARTNER_CHANGE,
      title: 'Duo Partner Update',
      message: `A duo partner has been ${action}`,
      metadata: { partnerId, action }
    });
  }
};