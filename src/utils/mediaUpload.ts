import { supabase } from "@/integrations/supabase/client";

export interface MediaUploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  compressionQuality: number;
  bucket: 'talent-files' | 'casting-assets';
  maxRetries?: number;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  path: string;
  size: number;
  mimeType: string;
}

const defaultConfig: MediaUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
  compressionQuality: 0.8,
  bucket: 'talent-files',
  maxRetries: 3
};

export class UploadError extends Error {
  constructor(
    message: string,
    public code: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'UPLOAD_FAILED' | 'COMPRESSION_FAILED'
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

export const uploadMedia = async (
  file: File,
  customConfig?: Partial<MediaUploadConfig>
): Promise<UploadResult> => {
  const config = { ...defaultConfig, ...customConfig };
  
  // Validation
  if (!config.allowedTypes.includes(file.type)) {
    throw new UploadError(
      `File type ${file.type} not supported. Allowed types: ${config.allowedTypes.join(', ')}`,
      'INVALID_TYPE'
    );
  }
  
  if (file.size > config.maxFileSize) {
    throw new UploadError(
      `File size (${formatFileSize(file.size)}) exceeds limit of ${formatFileSize(config.maxFileSize)}`,
      'FILE_TOO_LARGE'
    );
  }

  // Process file
  let processedFile: File;
  try {
    processedFile = file.type.startsWith('image/') 
      ? await compressImage(file, config.compressionQuality)
      : file;
  } catch (error) {
    throw new UploadError(
      'Failed to process image file',
      'COMPRESSION_FAILED'
    );
  }

  // Upload with retries
  let attempt = 0;
  while (attempt < (config.maxRetries || 1)) {
    try {
      const fileName = generateFileName(processedFile);
      const { data, error } = await supabase.storage
        .from(config.bucket)
        .upload(fileName, processedFile, {
          cacheControl: '3600',
          upsert: false,
          ...(config.onProgress && {
            onUploadProgress: (progress) => {
              const percentage = (progress.loaded / progress.total) * 100;
              config.onProgress!(percentage);
            }
          })
        });

      if (error) throw error;

      return {
        path: data.path,
        size: processedFile.size,
        mimeType: processedFile.type
      };
    } catch (error) {
      attempt++;
      if (attempt === config.maxRetries) {
        throw new UploadError(
          `Upload failed after ${config.maxRetries} attempts: ${error.message}`,
          'UPLOAD_FAILED'
        );
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new UploadError('Upload failed', 'UPLOAD_FAILED');
};

const compressImage = async (file: File, quality: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions (max 1920px width/height)
      const maxDim = 1920;
      let width = img.width;
      let height = img.height;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (height / width) * maxDim;
          width = maxDim;
        } else {
          width = (width / height) * maxDim;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const generateFileName = (file: File): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '-');

  return `${timestamp}-${random}-${cleanFileName}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};