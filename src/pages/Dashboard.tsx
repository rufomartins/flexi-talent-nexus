import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AddTalentModal } from "@/components/talents/AddTalentModal"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth"

export default function Dashboard() {
  const [addTalentOpen, setAddTalentOpen] = useState(false)
  const { user } = useAuth()

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
      return 0 // For now, returning 0 as there's no projects table yet
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

  // Show loading state only for initial load
  if (!user) {
    return null; // Let the ProtectedRoute handle the redirect
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Total Talents</h2>
          <p className="text-3xl font-bold">
            {talentsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              talentsCount
            )}
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Active Projects</h2>
          <p className="text-3xl font-bold">
            {projectsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              projectsCount
            )}
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Pending Reviews</h2>
          <p className="text-3xl font-bold">
            {reviewsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              reviewsCount
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