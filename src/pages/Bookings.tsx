import { BookingsList } from "@/components/bookings/BookingsList"

export default function Bookings() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
      </div>
      <BookingsList />
    </div>
  )
}