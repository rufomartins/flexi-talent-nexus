import { UserPlus, Users, FolderGit, Briefcase, DollarSign, Wallet } from "lucide-react"
import { StatCard } from "./StatCard"
import { useAuth } from "@/contexts/auth"

interface StatsGridProps {
  newRegistrations: number | null;
  talentsCount: number | null;
  projectsCount: number | null;
  activeCastingsCount: number | null;
  pendingPayments: number | null;
  availableFunds: number | null;
  isLoadingRegistrations: boolean;
  isLoadingTalents: boolean;
  isLoadingProjects: boolean;
  isLoadingCastings: boolean;
  isLoadingPayments: boolean;
  isLoadingFunds: boolean;
}

export const StatsGrid = ({
  newRegistrations,
  talentsCount,
  projectsCount,
  activeCastingsCount,
  pendingPayments,
  availableFunds,
  isLoadingRegistrations,
  isLoadingTalents,
  isLoadingProjects,
  isLoadingCastings,
  isLoadingPayments,
  isLoadingFunds,
}: StatsGridProps) => {
  const { userDetails } = useAuth();
  const isAdminOrSuperAdmin = userDetails?.role === 'admin' || userDetails?.role === 'super_admin';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="New Registrations"
        subtitle="Last 30 days"
        value={newRegistrations}
        icon={UserPlus}
        isLoading={isLoadingRegistrations}
      />
      
      <StatCard
        title="Total Talents"
        subtitle="Available"
        value={talentsCount}
        icon={Users}
        isLoading={isLoadingTalents}
      />
      
      <StatCard
        title="Active Projects"
        subtitle="In progress"
        value={projectsCount}
        icon={FolderGit}
        isLoading={isLoadingProjects}
      />

      <StatCard
        title="Active Castings"
        subtitle="Open castings"
        value={activeCastingsCount}
        icon={Briefcase}
        isLoading={isLoadingCastings}
      />

      {userDetails?.role === 'super_admin' && (
        <StatCard
          title="Pending Payments"
          subtitle="To talents"
          value={pendingPayments}
          icon={DollarSign}
          isLoading={isLoadingPayments}
        />
      )}

      {isAdminOrSuperAdmin && (
        <StatCard
          title="Available Funds"
          subtitle="Current balance"
          value={availableFunds}
          icon={Wallet}
          isLoading={isLoadingFunds}
        />
      )}
    </div>
  );
};