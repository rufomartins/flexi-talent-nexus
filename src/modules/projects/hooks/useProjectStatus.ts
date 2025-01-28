import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ProjectProgress, ProjectStatusType } from '../types';

export const useProjectStatus = (projectId: string) => {
  const { toast } = useToast();

  const calculateOverallStatus = useCallback((tasks: { talent_status: string }[]): ProjectStatusType => {
    if (!tasks.length) return 'Notified';
    if (tasks.every(task => task.talent_status === 'Approved')) return 'Approved';
    if (tasks.some(task => task.talent_status === 'Reshoot')) return 'Reshoot';
    if (tasks.some(task => task.talent_status === 'Shooting')) return 'Shooting';
    if (tasks.some(task => task.talent_status === 'Delivered')) return 'Delivered';
    if (tasks.some(task => task.talent_status === 'Booked')) return 'Booked';
    return 'Notified';
  }, []);

  const updateTaskStatus = useCallback(async (taskId: string, status: Exclude<ProjectStatusType, 'Notified'>) => {
    const { error } = await supabase
      .from('project_tasks')
      .update({ talent_status: status, updated_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Status Updated',
      description: `Task status has been updated to ${status}`,
    });
  }, [toast]);

  const getProjectProgress = useCallback(async (): Promise<ProjectProgress> => {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('talent_status')
      .eq('project_id', projectId);

    if (error) throw error;

    const totalTasks = data.length;
    const completedTasks = data.filter(task => task.talent_status === 'Approved').length;
    const status = calculateOverallStatus(data);

    return {
      totalTasks,
      completedTasks,
      status,
      lastUpdate: new Date().toISOString()
    };
  }, [projectId, calculateOverallStatus]);

  return {
    updateTaskStatus,
    getProjectProgress
  };
};