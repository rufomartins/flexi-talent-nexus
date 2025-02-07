
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/supabase";
type Json = Database['public']['Json'];

interface CandidateCommunicationProps {
  candidateId: string;
}

interface EmailLog {
  id: string;
  subject: string;
  sent_at: string;
  metadata: Json;
}

interface SmsLog {
  id: string;
  message: string;  
  sent_at: string | null;
  created_at: string;
  candidate_id: string;
}

interface CommunicationData {
  emails: EmailLog[];
  sms: SmsLog[];
}

export function CandidateCommunication({ candidateId }: CandidateCommunicationProps) {
  const { data: communications, isLoading } = useQuery({
    queryKey: ['candidate-communications', candidateId],
    queryFn: async () => {
      // Fetch email logs
      const emailResult = await supabase
        .from('email_logs')
        .select('id, subject, sent_at, metadata')
        .eq('metadata->candidate_id', candidateId)
        .order('sent_at', { ascending: false });
      if (emailResult.error) {
        throw emailResult.error;
      }

      // Fetch SMS logs
      const smsResult = await supabase
        .from('sms_logs')
        .select('id, message, sent_at, created_at, candidate_id')
        .eq('candidate_id', candidateId)
        .order('sent_at', { ascending: false });
      if (smsResult.error) {
        throw smsResult.error;
      }

      // Create communications object with our simplified types
      const communications: CommunicationData = {
        emails: emailResult.data,
        sms: smsResult.data,
      };
      return communications;
    },
  });

  if (isLoading) {
    return <div>Loading communication history...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Email History</h3>
        <div className="space-y-4">
          {communications?.emails.length ? (
            communications.emails.map((email) => (
              <Card key={email.id} className="p-4">
                <div>
                  <p className="font-medium">{email.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(email.sent_at).toLocaleString()}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <p>No email history</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">SMS History</h3>
        <div className="space-y-4">
          {communications?.sms.length ? (
            communications.sms.map((sms) => (
              <Card key={sms.id} className="p-4">
                <div>
                  <p className="text-sm whitespace-pre-wrap">{sms.message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(sms.sent_at || sms.created_at).toLocaleString()}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <p>No SMS history</p>
          )}
        </div>
      </div>
    </div>
  );
}
