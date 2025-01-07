import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { Database } from "@/integrations/supabase/types"

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  talent_profiles: {
    id: string
    user_id: string
    users: {
      id: string
      full_name: string | null
    } | null
  } | null
  projects: {
    name: string | null
  } | null
  castings: {
    name: string | null
  } | null
}

export function BookingsList() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          talent_profiles (
            id,
            user_id,
            users (
              id,
              full_name
            )
          ),
          projects (
            name
          ),
          castings (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Booking[]
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!bookings?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookings found
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {booking.projects?.name}
            </CardTitle>
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <div className="text-sm">
                Talent: {booking.talent_profiles?.users?.full_name}
              </div>
              <div className="text-sm text-muted-foreground">
                Casting: {booking.castings?.name}
              </div>
              <div className="text-sm text-muted-foreground">
                Created: {formatDate(booking.created_at)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getStatusVariant(status: string | null): "default" | "destructive" | "outline" | "secondary" {
  switch (status) {
    case 'confirmed':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}