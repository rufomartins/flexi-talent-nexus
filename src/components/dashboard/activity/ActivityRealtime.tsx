import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ActivityRealtimeProps {
  onUpdate: () => void;
}

export const ActivityRealtime = ({ onUpdate }: ActivityRealtimeProps) => {
  const { toast } = useToast();

  useEffect(() => {
    let toastTimeout: NodeJS.Timeout;
    const channel = supabase
      .channel('activity-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activity_logs'
        },
        () => {
          onUpdate();
          
          // Debounced toast notification
          clearTimeout(toastTimeout);
          toastTimeout = setTimeout(() => {
            toast({
              title: "New Activity",
              description: "New activities have been recorded",
              duration: 3000,
            });
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(toastTimeout);
      supabase.removeChannel(channel);
    };
  }, [onUpdate, toast]);

  return null;
};