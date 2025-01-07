import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TalentSearchDialog } from "@/components/talents/TalentSearchDialog"
import { AddTalentModal } from "@/components/talents/AddTalentModal"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TalentList = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [addTalentOpen, setAddTalentOpen] = useState(false)
  const { toast } = useToast()

  const { data: talents, isLoading, error } = useQuery({
    queryKey: ["talents"],
    queryFn: async () => {
      console.log("Fetching talents...")
      const { data, error } = await supabase
        .from("talent_profiles")
        .select(`
          id,
          user_id,
          category,
          evaluation_status,
          users!inner (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching talents:", error)
        toast({
          title: "Error loading talents",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }

      console.log("Fetched talents:", data)
      return data
    },
  })

  const handleSearch = async (searchValues: any) => {
    console.log("Search values:", searchValues)
    // Implement search logic here
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="text-center text-red-600">
          Error loading talents. Please try again later.
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Talents</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button onClick={() => setAddTalentOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Talent
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {talents && talents.length > 0 ? (
          talents.map((talent) => (
            <div
              key={talent.id}
              className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
            >
              <Avatar className="h-12 w-12">
                {talent.users?.avatar_url ? (
                  <AvatarImage
                    src={talent.users.avatar_url}
                    alt={`${talent.users.first_name} ${talent.users.last_name}`}
                  />
                ) : (
                  <AvatarFallback>
                    {talent.users?.first_name?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium">
                  <Link 
                    to={`/talents/${talent.id}`} 
                    className="hover:underline"
                  >
                    {talent.users?.first_name} {talent.users?.last_name}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {talent.category || "No category"}
                </p>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="capitalize">
                  {talent.evaluation_status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No talents found. Add your first talent to get started.
          </div>
        )}
      </div>

      <TalentSearchDialog 
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSearch={handleSearch}
      />

      <AddTalentModal
        open={addTalentOpen}
        onOpenChange={setAddTalentOpen}
      />
    </div>
  )
}

export default TalentList