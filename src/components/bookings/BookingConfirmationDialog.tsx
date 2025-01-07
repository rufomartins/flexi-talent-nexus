import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface BookingConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  talentId: string
  castingId: string
  projectId: string
  onConfirm: () => void
}

export function BookingConfirmationDialog({
  open,
  onOpenChange,
  talentId,
  castingId,
  projectId,
  onConfirm
}: BookingConfirmationDialogProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [requireConfirmation, setRequireConfirmation] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Create booking record with required start_date and end_date
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          talent_id: talentId,
          casting_id: castingId,
          project_id: projectId,
          status: 'pending',
          start_date: new Date().toISOString(), // Default to current date, you might want to add date pickers
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days from now
        })

      if (bookingError) throw bookingError

      toast({
        title: "Booking confirmation sent",
        description: "The talent will be notified about the booking.",
      })

      onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Booking Confirmation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Booking Confirmation for Project XYZ"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter booking details and instructions..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requireConfirmation"
              checked={requireConfirmation}
              onCheckedChange={(checked) => setRequireConfirmation(checked as boolean)}
            />
            <Label htmlFor="requireConfirmation">
              Ask talent for confirmation
            </Label>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !subject || !message}
          >
            {isSubmitting ? "Sending..." : "Send Booking Confirmation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}