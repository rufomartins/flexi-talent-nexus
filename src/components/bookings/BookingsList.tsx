import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { BookingStatusManager } from "./BookingStatusManager"
import type { Booking } from "@/types/booking"

export function BookingsList() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          talent_profiles!inner (
            id,
            user_id,
            users!inner (
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
      {bookings?.map((booking) => (
        <Card key={booking.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {booking.projects?.name}
            </CardTitle>
            <BookingStatusManager 
              bookingId={booking.id}
              currentStatus={booking.status}
              lastUpdated={booking.updated_at}
            />
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