export interface CastingForm {
  id: string;
  name: string;
  clientId: string;
  projectManagerId: string;
  type: 'internal' | 'external';
  logo?: string;
  briefing: string;
  status: 'open' | 'closed';
  customFields: CastingFormField[];
}

export interface CastingFormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'file' | 'multiselect';
  required: boolean;
  options?: string[];
  position: number;
}

export interface TalentAvailability {
  talentId: string;
  castingId: string;
  status: 'pending' | 'available' | 'unavailable';
  proposedFee?: number;
  finalFee?: number;
  dates: {
    from: string;
    to: string;
  }[];
  response?: string;
}

export interface ClientSelection {
  castingId: string;
  talentId: string;
  clientId: string;
  preference: number;
  status: 'selected' | 'rejected' | 'waitlist';
  comments?: string;
}