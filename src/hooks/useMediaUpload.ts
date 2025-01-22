import { useState } from 'react';
import { uploadMedia, MediaUploadConfig, UploadResult, UploadError } from '@/utils/mediaUpload';

interface UseMediaUploadOptions extends Partial<MediaUploadConfig> {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: UploadError) => void;
}

export const useMediaUpload = (options: UseMediaUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<UploadError | null>(null);

  const upload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await uploadMedia(file, {
        ...options,
        onProgress: (progress) => {
          setProgress(progress);
          options.onProgress?.(progress);
        }
      });

      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const uploadError = err instanceof UploadError 
        ? err 
        : new UploadError('Upload failed', 'UPLOAD_FAILED');
      
      setError(uploadError);
      options.onError?.(uploadError);
      throw uploadError;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    progress,
    error,
    reset: () => {
      setIsUploading(false);
      setProgress(0);
      setError(null);
    }
  };
};