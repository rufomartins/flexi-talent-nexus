export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  category: 'photo' | 'video' | 'audio';
  created_at: string;
  is_profile: boolean;
  is_shared: boolean;
  position: number;
}