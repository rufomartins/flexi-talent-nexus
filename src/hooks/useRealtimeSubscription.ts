import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export const useRealtimeSubscription = (
  table: string,
  onUpdate: () => void
) => {
  useEffect(() => {
    const channel = supabase.channel('db-changes')
      .on(
        'postgres_changes' as const,
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
          console.log('Change received!', payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onUpdate]);
};