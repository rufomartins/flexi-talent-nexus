
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

interface CandidateCommunicationProps {
  candidateId: string;
}

// Radically simplified types
interface EmailLog {
  id: string;
  subject: string;
  sent_at: string;
  metadata: any; // Simplified to any
}

interface SmsLog {
  id: string;
  message: string;
  sent_at: string | null;
  created_at: string;
  candidate_id: string;
}

interface CommunicationData {
  emails: any[]; // Simplified to any[]
  sms: any[];    // Simplified to any[]
}

export function CandidateCommunication({ candidateId }: CandidateCommunicationProps) {
  const { data: communications, isLoading } = useQuery({
    queryKey: ['candidate-communications', candidateId],
    queryFn: async () => {
      // Return hardcoded basic object for debugging
      const communications: CommunicationData = {
        emails: [], // Hardcoded empty array
        sms: [],    // Hardcoded empty array
      };
      return communications;
    },
  });

  if (isLoading) {
    return <div>Loading communication history...</div>;
  }

  // Minimal return for testing
  return <div>Testing - No Rendering</div>;

  /* COMMENTED OUT FOR DEBUGGING
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
  */
}
