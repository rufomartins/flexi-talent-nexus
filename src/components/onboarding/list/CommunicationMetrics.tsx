import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MetricsData {
  emailsSent: number;
  smsSent: number;
  successRate: number;
  failureRate: number;
}

export function CommunicationMetrics() {
  const { data: metrics } = useQuery({
    queryKey: ['communication-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_logs')
        .select('notification_type, status')
        .in('notification_type', ['EMAIL', 'SMS']);

      if (error) {
        console.error('Error fetching metrics:', error);
        return {
          emailsSent: 0,
          smsSent: 0,
          successRate: 0,
          failureRate: 0
        };
      }

      const total = data.length;
      const successful = data.filter(log => log.status === 'sent').length;
      
      return {
        emailsSent: data.filter(log => log.notification_type === 'EMAIL').length,
        smsSent: data.filter(log => log.notification_type === 'SMS').length,
        successRate: total ? (successful / total) * 100 : 0,
        failureRate: total ? ((total - successful) / total) * 100 : 0
      };
    }
  });

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-card p-4 rounded-lg">
        <h3 className="text-sm font-medium">Emails Sent</h3>
        <p className="text-2xl font-bold">{metrics.emailsSent}</p>
      </div>
      <div className="bg-card p-4 rounded-lg">
        <h3 className="text-sm font-medium">SMS Sent</h3>
        <p className="text-2xl font-bold">{metrics.smsSent}</p>
      </div>
      <div className="bg-card p-4 rounded-lg">
        <h3 className="text-sm font-medium">Success Rate</h3>
        <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
      </div>
      <div className="bg-card p-4 rounded-lg">
        <h3 className="text-sm font-medium">Failure Rate</h3>
        <p className="text-2xl font-bold">{metrics.failureRate.toFixed(1)}%</p>
      </div>
    </div>
  );
}