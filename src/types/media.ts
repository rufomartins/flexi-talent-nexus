export type MediaCategory = 'photo' | 'video' | 'audio';

export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: MediaCategory;
  created_at: string;
  is_profile: boolean;
  is_shared: boolean;
  position: number;
  talent_id?: string;
  updated_at?: string;
  mime_type?: string;
}