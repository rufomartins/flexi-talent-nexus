import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileUpload, UploadConfig } from '@/types/casting';

export const useFileUpload = (config: Record<string, UploadConfig>) => {
  const [files, setFiles] = useState<Record<string, FileUpload>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleFileSelect = useCallback(async (type: string, file: File) => {
    if (!config[type]) {
      throw new Error(`Invalid file type: ${type}`);
    }

    if (!config[type].allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${config[type].allowedTypes.join(', ')}`);
    }

    if (file.size > config[type].maxSize) {
      throw new Error(`File too large. Maximum size: ${config[type].maxSize / 1024 / 1024}MB`);
    }

    const preview = URL.createObjectURL(file);

    setFiles(prev => ({
      ...prev,
      [type]: { file, preview }
    }));

    return { file, preview };
  }, [config]);

  const uploadFile = useCallback(async (type: string, file: File) => {
    if (!config[type]) {
      throw new Error(`Invalid file type: ${type}`);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${config[type].path}/${fileName}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('castings')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [type]: (progress.loaded / progress.total) * 100
            }));
          }
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('castings')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  }, [config]);

  const removeFile = useCallback(async (type: string) => {
    if (files[type]?.preview) {
      URL.revokeObjectURL(files[type].preview);
    }

    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });

    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[type];
      return newProgress;
    });
  }, [files]);

  return {
    files,
    uploadProgress,
    handleFileSelect,
    uploadFile,
    removeFile
  };
};