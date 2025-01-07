import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddTalentModal } from "@/components/talents/AddTalentModal"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { UserPlus, Users, FolderGit, Briefcase, DollarSign } from "lucide-react"
import { useAuth } from "@/contexts/auth"
import { StatCard } from "@/components/dashboard/StatCard"

export default function Dashboard() {
  const [addTalentOpen, setAddTalentOpen] = useState(false)
  const { user, userDetails } = useAuth()

  const { data: newRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ['new-registrations'],
    queryFn: async () => {
      if (!user) return 0;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count, error } = await supabase
        .from('talent_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      if (error) {
        console.error('Error fetching new registrations:', error)
        return 0
      }

      return count || 0
    },
    enabled: !!user
  })

  const { data: talentsCount, isLoading: talentsLoading } = useQuery({
    queryKey: ['talents-count'],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('talent_profiles')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error fetching talents count:', error)
        return 0
      }

      return count || 0
    },
    enabled: !!user
  })

  const { data: projectsCount, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects-count'],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      if (error) {
        console.error('Error fetching projects count:', error)
        return 0
      }

      return count || 0
    },
    enabled: !!user
  })

  const { data: activeCastingsCount, isLoading: castingsLoading } = useQuery({
    queryKey: ['active-castings-count'],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('castings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')

      if (error) {
        console.error('Error fetching active castings count:', error)
        return 0
      }

      return count || 0
    },
    enabled: !!user
  })

  const { data: pendingPayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['pending-payments'],
    queryFn: async () => {
      if (!user || userDetails?.role !== 'super_admin') return 0;
      
      const { data, error } = await supabase
        .from('casting_talents')
        .select('final_fee')
        .not('final_fee', 'is', null)

      if (error) {
        console.error('Error fetching pending payments:', error)
        return 0
      }

      return data.reduce((sum, item) => sum + (item.final_fee || 0), 0)
    },
    enabled: !!user && userDetails?.role === 'super_admin'
  })

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setAddTalentOpen(true)}>
          Add new talent
        </Button>
      </div>

      <AddTalentModal 
        open={addTalentOpen}
        onOpenChange={setAddTalentOpen}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="New Registrations"
          subtitle="Last 30 days"
          value={newRegistrations}
          icon={UserPlus}
          isLoading={registrationsLoading}
        />
        
        <StatCard
          title="Total Talents"
          subtitle="Available"
          value={talentsCount}
          icon={Users}
          isLoading={talentsLoading}
        />
        
        <StatCard
          title="Active Projects"
          subtitle="In progress"
          value={projectsCount}
          icon={FolderGit}
          isLoading={projectsLoading}
        />

        <StatCard
          title="Active Castings"
          subtitle="Open castings"
          value={activeCastingsCount}
          icon={Briefcase}
          isLoading={castingsLoading}
        />

        {userDetails?.role === 'super_admin' && (
          <StatCard
            title="Pending Payments"
            subtitle="To talents"
            value={pendingPayments}
            icon={DollarSign}
            isLoading={paymentsLoading}
          />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-muted-foreground text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  )
}