import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { FileMetadata } from '../types';

interface UseProjectFiles {
  uploadFile: (projectId: string, file: File) => Promise<string>;
  deleteFile: (fileId: string) => Promise<void>;
  updateFileMetadata: (fileId: string, metadata: FileMetadata) => Promise<void>;
}

export const useProjectFiles = (): UseProjectFiles => {
  const { toast } = useToast();

  const uploadFile = useCallback(async (projectId: string, file: File): Promise<string> => {
    try {
      const filePath = `projects/${projectId}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: fileRecord, error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          version: 1
        })
        .select('id')
        .single();

      if (dbError) throw dbError;

      toast({
        title: "File Uploaded",
        description: "File has been uploaded successfully"
      });

      return fileRecord.id;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      // First get the file path
      const { data: file, error: fetchError } = await supabase
        .from('project_files')
        .select('file_path')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: "File Deleted",
        description: "File has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateFileMetadata = useCallback(async (fileId: string, metadata: FileMetadata): Promise<void> => {
    try {
      const { error } = await supabase
        .from('project_files')
        .update({
          file_name: metadata.name,
          file_type: metadata.type,
          file_size: metadata.size,
          version: metadata.version
        })
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Metadata Updated",
        description: "File metadata has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating file metadata:', error);
      toast({
        title: "Error",
        description: "Failed to update file metadata",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    uploadFile,
    deleteFile,
    updateFileMetadata
  };
};