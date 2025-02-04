import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

interface CandidateCommunicationProps {
  candidateId: string;
}

export function CandidateCommunication({ candidateId }: CandidateCommunicationProps) {
  const { data: communications, isLoading } = useQuery({
    queryKey: ['candidate-communications', candidateId],
    queryFn: async () => {
      const emailLogs = supabase
        .from('email_logs')
        .select('*')
        .eq('metadata->candidate_id', candidateId)
        .order('sent_at', { ascending: false });

      const smsLogs = supabase
        .from('sms_logs')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('sent_at', { ascending: false });

      const [emailResult, smsResult] = await Promise.all([emailLogs, smsLogs]);

      if (emailResult.error) throw emailResult.error;
      if (smsResult.error) throw smsResult.error;

      return {
        emails: emailResult.data || [],
        sms: smsResult.data || []
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