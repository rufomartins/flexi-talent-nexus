import { Card } from "@/components/ui/card";

interface CommunicationMetricsProps {
  ingestCount: number;
  processCount: number;
  emailsSent: number;
  emailsFailed: number;
  interviewsScheduled: number;
  chatbotConfirmed: number;
  chatbotDeclined: number;
  preScreeningPending: number;
}

export function CommunicationMetrics({
  ingestCount,
  processCount,
  emailsSent,
  emailsFailed,
  interviewsScheduled,
  chatbotConfirmed,
  chatbotDeclined,
  preScreeningPending
}: CommunicationMetricsProps) {
  const metrics = [
    { label: "Candidates in Ingest", value: ingestCount },
    { label: "Candidates in Process", value: processCount },
    { label: "Emails Sent", value: emailsSent },
    { label: "Emails Failed", value: emailsFailed },
    { label: "Interviews Scheduled", value: interviewsScheduled },
    { label: "Chatbot Confirmed", value: chatbotConfirmed },
    { label: "Chatbot Declined", value: chatbotDeclined },
    { label: "Pre-Screening Pending", value: preScreeningPending }
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">{metric.label}</h3>
          <p className="text-2xl font-bold mt-2">{metric.value}</p>
        </Card>
      ))}
    </>
  );
}