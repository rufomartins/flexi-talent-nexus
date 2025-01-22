import { useEffect } from "react";
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeSubscription = <T extends Record<string, any>>(
  tableName: string,
  eventType: 'INSERT' | 'UPDATE' | 'DELETE',
  onData: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${tableName}`)
      .on(
        'postgres_changes' as const,
        { 
          event: eventType,
          schema: 'public',
          table: tableName 
        },
        (payload) => onData(payload as RealtimePostgresChangesPayload<T>)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, eventType, onData]);
};