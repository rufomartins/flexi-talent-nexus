export type UserRole = 'super_admin' | 'admin' | 'super_user' | 'user' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  gender: string | null;
  mobile_phone: string | null;
  nationality: string | null;
  avatar_url: string | null;
  created_at: string | null;
  last_login: string | null;
  role: UserRole;
  status: UserStatus;
  company_id?: string | null;
  full_name: string | null;
}