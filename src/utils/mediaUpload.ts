import { supabase } from "@/integrations/supabase/client";

interface UploadConfig {
  maxSize: number;
  allowedTypes: string[];
  compression: boolean;
}

const compressImage = async (file: File): Promise<File> => {
  // Basic image compression using canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Set target dimensions (max 1200px width/height)
      const maxDim = 1200;
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
        0.8
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

export const uploadMedia = async (
  file: File,
  config: UploadConfig
): Promise<string> => {
  if (file.size > config.maxSize) {
    throw new Error(`File size exceeds limit of ${config.maxSize / (1024 * 1024)}MB`);
  }

  if (!config.allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
  }
  
  const compressedFile = config.compression && file.type.startsWith('image/')
    ? await compressImage(file)
    : file;
    
  const { data, error } = await supabase.storage
    .from('talent-files')
    .upload(`${Date.now()}-${file.name}`, compressedFile);

  if (error) throw error;
  
  return data.path;
};