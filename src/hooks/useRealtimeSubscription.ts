import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeSubscription(
  tableName: string,
  onUpdate: (payload: any) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: tableName
        },
        onUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, onUpdate]);
}