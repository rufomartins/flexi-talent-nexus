import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Upload } from "lucide-react"

interface BookingConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  talentId: string
  castingId: string
  projectId: string
  onConfirm: () => void
  talentCount?: number
}

export function BookingConfirmationDialog({
  open,
  onOpenChange,
  talentId,
  castingId,
  projectId,
  onConfirm,
  talentCount = 1
}: BookingConfirmationDialogProps) {
  const [subject, setSubject] = useState("New confirmation")
  const [message, setMessage] = useState("")
  const [requireConfirmation, setRequireConfirmation] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          talent_id: talentId,
          casting_id: castingId,
          project_id: projectId,
          status: 'pending',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })

      if (bookingError) throw bookingError

      toast({
        title: "Successfully started sending booking",
        description: `Successfully started sending booking to ${talentCount} talent${talentCount > 1 ? 's' : ''}`,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Booking confirmation</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Sending to {talentCount} talent{talentCount > 1 ? 's' : ''}
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject (will be used in mail)</Label>
            <div className="flex gap-2">
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1"
              />
              <select 
                className="border rounded-md px-3 py-2 bg-background"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="New confirmation">New confirmation</option>
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Text (will be used in mail)</Label>
            <div className="relative">
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="absolute top-2 right-2 space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setMessage(msg => msg + "{First Name}")}
                >
                  {"{First Name}"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setMessage(msg => msg + "{Last Name}")}
                >
                  {"{Last Name}"}
                </Button>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-accent">
            <Upload className="mr-2 h-4 w-4" />
            <span>Add file</span>
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
        <div className="flex justify-start space-x-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !subject || !message}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Send booking confirmation
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}