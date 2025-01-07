import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth"

export default function Projects() {
  const { user } = useAuth()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(name)')
      
      if (error) {
        console.error('Error fetching projects:', error)
        return []
      }

      return data || []
    },
    enabled: !!user
  })

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>

      {projects?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects?.map((project) => (
            <div 
              key={project.id} 
              className="bg-card p-4 rounded-lg shadow"
            >
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm text-muted-foreground">
                Client: {project.clients?.name || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {project.status || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}