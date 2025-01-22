import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { BookingStatusManager } from "./BookingStatusManager"
import { Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/usePagination"
import type { Booking } from "@/types/booking"

export function BookingsList() {
  const fetchBookings = async (page: number, pageSize: number) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const countQuery = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true });

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
      .range(from, to);

    if (error) throw error;

    return {
      data: data as unknown as Booking[],
      count: countQuery.count || 0
    };
  };

  const {
    data: bookings,
    loading: isLoading,
    page,
    setPage,
    totalPages,
  } = usePagination(fetchBookings, {
    pageSize: 10,
    initialPage: 1
  });

  if (isLoading && !bookings?.length) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookings found
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}