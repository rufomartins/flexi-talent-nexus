import { User } from "./user";

export type TalentStatus = "approved" | "under_evaluation" | "rejected";

export interface TalentProfileData {
  user: User;
  talent_profile: {
    category: string | null;
    evaluation_status: TalentStatus | null;
    internal_remarks: string | null;
  };
}