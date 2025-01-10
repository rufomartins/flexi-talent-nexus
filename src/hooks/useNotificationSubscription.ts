import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import type { TalentNotification } from '@/types/notifications';
import { useToast } from '@/hooks/use-toast';

export function useNotificationSubscription(talentId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`talent-notifications-${talentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'talent_notifications',
          filter: `talent_id=eq.${talentId}`
        },
        (payload) => {
          console.log('Notification change received:', payload);

          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            queryClient.setQueryData<TalentNotification[]>(
              ['talent-notifications', talentId],
              (old = []) => [payload.new as TalentNotification, ...old]
            );

            // Show toast for new notification
            toast({
              title: (payload.new as TalentNotification).title,
              description: (payload.new as TalentNotification).message,
            });
          }

          // Invalidate queries to ensure data is fresh
          queryClient.invalidateQueries({ 
            queryKey: ['talent-notifications', talentId] 
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to notification changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to notifications');
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to notification service',
            variant: 'destructive',
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [talentId, queryClient, toast]);
}