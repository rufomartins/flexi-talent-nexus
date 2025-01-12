import type { Json } from '@/integrations/supabase/types';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export type { Json };