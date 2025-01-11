import { supabase } from '@/integrations/supabase/client';
import type { TimelineEventType } from '@/types/supabase/timeline';

export const bookingLogger = {
  async logEvent(
    bookingId: string,
    eventType: TimelineEventType,
    details: Record<string, any>
  ) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase
      .from('booking_timeline_events')
      .insert({
        booking_id: bookingId,
        event_type: eventType,
        user_id: userData.user.id,
        details
      });

    if (error) {
      console.error('Error logging booking event:', error);
      throw error;
    }
  },

  async logStatusChange(bookingId: string, previousStatus: string, newStatus: string) {
    return this.logEvent(bookingId, 'status_change', {
      previous_status: previousStatus,
      new_status: newStatus
    });
  },

  async logFileUpload(bookingId: string, fileName: string) {
    return this.logEvent(bookingId, 'file_upload', {
      file_name: fileName
    });
  },

  async logComment(bookingId: string, commentText: string) {
    return this.logEvent(bookingId, 'comment', {
      comment_text: commentText
    });
  },

  async logEmailSent(bookingId: string, emailTemplateId: string) {
    return this.logEvent(bookingId, 'email_sent', {
      email_template_id: emailTemplateId
    });
  },

  async logBookingCreated(bookingId: string) {
    return this.logEvent(bookingId, 'booking_created', {});
  },

  async logBookingUpdated(bookingId: string, changes: Record<string, any>) {
    return this.logEvent(bookingId, 'booking_updated', {
      changes
    });
  }
};