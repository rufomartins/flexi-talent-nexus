import { supabase } from "@/integrations/supabase/client";
import type { NotificationMetadata, NotificationType } from "@/types/notifications";

export const handleAssignmentNotification = async (
  metadata: NotificationMetadata,
  type: NotificationType
) => {
  const notificationData = {
    type,
    metadata: JSON.stringify(metadata),
    status: 'pending' as const
  };

  const { error } = await supabase
    .from('notification_queue')
    .insert(notificationData);

  if (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
};