
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Project, ShotList } from '@/types/project';

interface UseProjectManagement {
  createProject: (data: Omit<Project, 'id'>) => Promise<string>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  addShotList: (taskId: string, data: Omit<ShotList, 'id' | 'task_id'>) => Promise<string>;
  updateShotList: (id: string, data: Partial<ShotList>) => Promise<void>;
}

export const useProjectManagement = (): UseProjectManagement => {
  const { toast } = useToast();

  const createProject = useCallback(async (data: Omit<Project, 'id'>): Promise<string> => {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          name: data.name,
          client_id: data.client_id,
          status: data.status,
          start_date: data.start_date,
          end_date: data.end_date
        })
        .select('id')
        .single();

      if (error) throw error;
      
      toast({
        title: "Project Created",
        description: "Project has been created successfully"
      });

      return project.id;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Project Updated",
        description: "Project has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const addShotList = useCallback(async (
    taskId: string, 
    data: Omit<ShotList, 'id' | 'task_id'>
  ): Promise<string> => {
    try {
      const { data: shotList, error } = await supabase
        .from('shot_lists')
        .insert({
          task_id: taskId,
          name: data.name,
          shared_with: data.shared_with,
          version: 1
        })
        .select('id')
        .single();

      if (error) throw error;
      
      toast({
        title: "Shot List Added",
        description: "Shot list has been added successfully"
      });

      return shotList.id;
    } catch (error) {
      console.error('Error adding shot list:', error);
      toast({
        title: "Error",
        description: "Failed to add shot list",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateShotList = useCallback(async (id: string, data: Partial<ShotList>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('shot_lists')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Shot List Updated",
        description: "Shot list has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating shot list:', error);
      toast({
        title: "Error",
        description: "Failed to update shot list",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    createProject,
    updateProject,
    addShotList,
    updateShotList
  };
};
