
import { useQuery } from "@tanstack/react-query";
import { PostgrestError, Json } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

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
  const { data: communications, isLoading } = useQuery<CommunicationData, PostgrestError>({
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

      // Return properly typed data
      return {
        emails: emailResult.data as EmailLog[] || [],
        sms: smsResult.data as SmsLog[] || []
      };
    }
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
