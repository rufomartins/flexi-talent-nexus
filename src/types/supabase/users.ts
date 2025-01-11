import { BaseRecord } from './base';

/** Available user roles in the system */
export type UserRole = 'super_admin' | 'admin' | 'super_user' | 'user';

/** User record from the database */
export interface User extends BaseRecord {
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  company_id?: string;
  status: 'active' | 'inactive';
}

/** Talent profile with associated user data */
export interface TalentProfile extends BaseRecord {
  user_id: string;
  category?: string;
  internal_remarks?: string;
  evaluation_status: string;
  users: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}