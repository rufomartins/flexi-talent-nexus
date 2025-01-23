import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmailRecipient {
  email: string;
  name: string;
}

interface EmailData {
  template_id: string;
  recipient: EmailRecipient;
  subject?: string;
  body?: string;
  metadata?: Record<string, any>;
}

export function useEmailSender() {
  return useMutation({
    mutationFn: async (emailData: EmailData) => {
      const { error } = await supabase.functions.invoke('handle-booking-email', {
        body: { emailData }
      });

      if (error) throw error;
    }
  });
}