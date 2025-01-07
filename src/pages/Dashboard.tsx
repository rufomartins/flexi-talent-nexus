import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/auth"
import { AddTalentModal } from "@/components/talents/AddTalentModal"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { StatsGrid } from "@/components/dashboard/StatsGrid"
import { RecentActivity } from "@/components/dashboard/RecentActivity"

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

  const { data: availableFunds, isLoading: fundsLoading } = useQuery({
    queryKey: ['available-funds'],
    queryFn: async () => {
      if (!user || (userDetails?.role !== 'super_admin' && userDetails?.role !== 'admin')) return 0;
      
      // For now, we'll return a mock value since the financial module is not yet implemented
      return 10000;
    },
    enabled: !!user && (userDetails?.role === 'super_admin' || userDetails?.role === 'admin')
  })

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <DashboardHeader onAddTalent={() => setAddTalentOpen(true)} />

      <AddTalentModal 
        open={addTalentOpen}
        onOpenChange={setAddTalentOpen}
      />
      
      <StatsGrid
        newRegistrations={newRegistrations}
        talentsCount={talentsCount}
        projectsCount={projectsCount}
        activeCastingsCount={activeCastingsCount}
        pendingPayments={pendingPayments}
        availableFunds={availableFunds}
        isLoadingRegistrations={registrationsLoading}
        isLoadingTalents={talentsLoading}
        isLoadingProjects={projectsLoading}
        isLoadingCastings={castingsLoading}
        isLoadingPayments={paymentsLoading}
        isLoadingFunds={fundsLoading}
      />

      <RecentActivity />
    </div>
  )
}