import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface RealtimeConfig {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  schema?: string
  table: string
  filter?: string
}

export function useRealtimeSubscription(
  config: RealtimeConfig,
  callback: (payload: any) => void
) {
  useEffect(() => {
    let channel: RealtimeChannel

    const setupSubscription = () => {
      channel = supabase
        .channel('db-changes')
        .on(
          'postgres_changes',
          {
            event: config.event || '*',
            schema: config.schema || 'public',
            table: config.table,
            filter: config.filter,
          },
          callback
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [config, callback])
}