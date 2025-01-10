import { Database } from "@/integrations/supabase/types";

type DatabaseUser = Database["public"]["Tables"]["users"]["Row"];

export const canViewAgents = (user: DatabaseUser) => {
  return user.role === 'super_admin';
};

export const canManageAgents = (user: DatabaseUser) => {
  return user.role === 'super_admin';
};

export const canManageTalents = (user: DatabaseUser) => {
  return ['super_admin', 'admin', 'super_user'].includes(user.role);
};

export const canViewAgentTalents = (user: DatabaseUser, agentId: string) => {
  return user.role === 'super_admin' || user.id === agentId;
};