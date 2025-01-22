import { Database } from "@/integrations/supabase/types"

export type TalentCategory = 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER'
export type TalentType = 'individual' | 'duo' | 'agent'

export interface TalentProfile {
  id: string
  name: string
  category: TalentCategory
  type: TalentType
  country: string
  nativeLanguage: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  lastActivity: string
  isAgent: boolean
  agentId?: string
  createdBy: string
}

export interface TalentStats {
  total: number
  approved: number
  pending: number
  rejected: number
}