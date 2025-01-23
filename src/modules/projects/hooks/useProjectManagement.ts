import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Project, ShotList, ProjectTask } from '../types';

interface UseProjectManagement {
  createProject: (data: Omit<Project, 'id'>) => Promise<string>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  addShotList: (projectId: string, data: Omit<ShotList, 'id' | 'projectId'>) => Promise<string>;
  updateShotList: (id: string, data: Partial<ShotList>) => Promise<void>;
  addTask: (projectId: string, data: Omit<ProjectTask, 'id' | 'projectId'>) => Promise<string>;
  updateTask: (id: string, data: Partial<ProjectTask>) => Promise<void>;
}

export const useProjectManagement = (): UseProjectManagement => {
  const { toast } = useToast();

  const createProject = useCallback(async (data: Omit<Project, 'id'>): Promise<string> => {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert(data)
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
    projectId: string, 
    data: Omit<ShotList, 'id' | 'projectId'>
  ): Promise<string> => {
    try {
      const { data: shotList, error } = await supabase
        .from('shot_lists')
        .insert({ ...data, project_id: projectId })
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

  const addTask = useCallback(async (
    projectId: string,
    data: Omit<ProjectTask, 'id' | 'projectId'>
  ): Promise<string> => {
    try {
      const { data: task, error } = await supabase
        .from('project_tasks')
        .insert({ ...data, project_id: projectId })
        .select('id')
        .single();

      if (error) throw error;
      
      toast({
        title: "Task Added",
        description: "Task has been added successfully"
      });

      return task.id;
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateTask = useCallback(async (id: string, data: Partial<ProjectTask>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    createProject,
    updateProject,
    addShotList,
    updateShotList,
    addTask,
    updateTask
  };
};