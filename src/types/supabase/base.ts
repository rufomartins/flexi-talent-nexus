import type { Json } from '@/integrations/supabase/types';

export interface BaseRecord {
  id: string;
  created_at: string;
  updated_at?: string;
}

export type { Json };