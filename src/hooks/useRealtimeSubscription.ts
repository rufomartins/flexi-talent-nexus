import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useRealtimeSubscription = <T>(
  tableName: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${tableName}`)
      .on(
        'postgres_changes' as const,
        {
          event: event,
          schema: 'public',
          table: tableName
        },
        (payload) => callback(payload as RealtimePostgresChangesPayload<T>)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, event, callback]);
};