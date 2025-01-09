import { User } from "@/types/user";

export const canViewAgents = (user: User) => {
  return user.role === 'super_admin';
};

export const canManageAgents = (user: User) => {
  return user.role === 'super_admin';
};

export const canManageTalents = (user: User) => {
  return ['super_admin', 'admin', 'super_user'].includes(user.role);
};