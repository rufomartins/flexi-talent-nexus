export const STORAGE_CONFIG = {
  BUCKET_NAME: 'talent-files',
  MAX_FILE_SIZES: {
    photo: 20 * 1024 * 1024, // 20MB
    video: 100 * 1024 * 1024, // 100MB
    audio: 50 * 1024 * 1024  // 50MB
  },
  ALLOWED_TYPES: {
    photo: ['image/jpeg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/quicktime', 'video/webm'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  }
};