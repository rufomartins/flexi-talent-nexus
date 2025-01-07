import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TalentSearchDialog } from "@/components/talents/TalentSearchDialog"
import { AddTalentModal } from "@/components/talents/AddTalentModal"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"

const TalentList = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [addTalentOpen, setAddTalentOpen] = useState(false)
  const { toast } = useToast()

  const { data: talents, isLoading } = useQuery({
    queryKey: ["talents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_profiles")
        .select(`
          id,
          user_id,
          category,
          evaluation_status,
          users:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          title: "Error loading talents",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }
      return data
    },
  })

  const handleSearch = async (searchValues: any) => {
    console.log("Search values:", searchValues)
    // Implement search logic here
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
        {talents?.map((talent) => (
          <div
            key={talent.id}
            className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              {talent.users?.avatar_url ? (
                <img
                  src={talent.users.avatar_url}
                  alt={`${talent.users.first_name} ${talent.users.last_name}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium text-muted-foreground">
                  {talent.users?.first_name?.[0]}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium">
                <Link to={`/talents/${talent.id}`} className="hover:underline">
                  {talent.users?.first_name} {talent.users?.last_name}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground">
                {talent.category || "No category"}
              </p>
            </div>
            <div className="ml-auto">
              <span className="text-sm bg-muted px-2 py-1 rounded">
                {talent.evaluation_status}
              </span>
            </div>
          </div>
        ))}
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