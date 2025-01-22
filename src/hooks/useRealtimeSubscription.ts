import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeSubscription(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  callback: (payload: any) => void
) {
  useEffect(() => {
    const subscription = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: event,
          schema: 'public',
          table: table
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, event, callback]);
}