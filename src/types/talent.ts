export interface TalentProfile {
  id: string
  user_id: string
  category: string | null
  internal_remarks: string | null
  evaluation_status: 'under_evaluation' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface TalentUser {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  mobile_phone: string | null
  gender: string | null
  nationality: string | null
  role: 'ugc_talent'
  status: 'active' | 'inactive' | 'suspended'
  avatar_url: string | null
  created_at: string
  updated_at: string
}