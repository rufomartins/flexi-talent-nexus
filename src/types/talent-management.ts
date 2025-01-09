import { User } from "./user";

export enum TalentCategory {
  UGC = 'UGC',
  TRANSLATOR = 'TRANSLATOR',
  REVIEWER = 'REVIEWER',
  VOICE_OVER = 'VOICE_OVER'
}

export enum TalentType {
  INDIVIDUAL = 'individual',
  DUO = 'duo',
  AGENT = 'agent'
}

export interface TalentProfile {
  id: string;
  name: string;
  category: TalentCategory;
  type: TalentType;
  country: string;
  nativeLanguage: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  lastActivity: string;
  isAgent: boolean;
  agentId?: string;
  createdBy: string;
}

export interface TalentStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}