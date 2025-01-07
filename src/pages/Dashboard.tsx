import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddTalentModal } from "@/components/talents/AddTalentModal"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, UserPlus, Users, FolderGit, ClipboardCheck, Briefcase } from "lucide-react"
import { useAuth } from "@/contexts/auth"

export default function Dashboard() {
  const [addTalentOpen, setAddTalentOpen] = useState(false)
  const { user } = useAuth()

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

  const { data: reviewsCount, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews-count'],
    queryFn: async () => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('talent_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('evaluation_status', 'under_evaluation')

      if (error) {
        console.error('Error fetching reviews count:', error)
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
        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">New Registrations</h2>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-4">
            {registrationsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              newRegistrations
            )}
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Total Talents</h2>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-4">
            {talentsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              talentsCount
            )}
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Active Projects</h2>
              <p className="text-sm text-muted-foreground">In progress</p>
            </div>
            <FolderGit className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-4">
            {projectsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              projectsCount
            )}
          </p>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Active Castings</h2>
              <p className="text-sm text-muted-foreground">Open castings</p>
            </div>
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-4">
            {castingsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              activeCastingsCount
            )}
          </p>
        </div>
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