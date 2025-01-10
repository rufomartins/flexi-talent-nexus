import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import type { TalentNotification } from '@/types/notifications';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useTalentNotifications(talentId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['talent-notifications', talentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_notifications')
        .select('*')
        .eq('talent_id', talentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TalentNotification[];
    }
  });

  // Mark as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<TalentNotification[]>(
        ['talent-notifications', talentId],
        (old) => old?.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  });

  // Get preferences
  const { data: preferences } = useQuery({
    queryKey: ['notification-preferences', talentId],
    queryFn: () => notificationService.getUserPreferences(talentId)
  });

  // Update preferences mutation
  const { mutate: updatePreferences } = useMutation({
    mutationFn: notificationService.updateUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences', talentId] });
      toast({
        title: 'Success',
        description: 'Notification preferences updated',
      });
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
    }
  });

  return {
    notifications,
    isLoading,
    markAsRead,
    preferences,
    updatePreferences
  };
}