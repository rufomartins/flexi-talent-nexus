import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InterviewSchedulerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
  candidateName: string;
}

export function InterviewSchedulerDialog({
  open,
  onOpenChange,
  candidateId,
  candidateName,
}: InterviewSchedulerDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Fetch unavailable time slots when date changes
  useEffect(() => {
    const fetchUnavailableSlots = async () => {
      if (!date) return;

      try {
        const { data: existingInterviews, error } = await supabase
          .from('interviews')
          .select('scheduled_at')
          .eq('status', 'scheduled')
          .gte('scheduled_at', format(date, 'yyyy-MM-dd'))
          .lt('scheduled_at', format(date, 'yyyy-MM-dd 23:59:59'));

        if (error) throw error;

        const unavailable = existingInterviews.map(interview => 
          format(new Date(interview.scheduled_at), 'HH:mm')
        );
        setUnavailableSlots(unavailable);
      } catch (error) {
        console.error('Error fetching unavailable slots:', error);
        toast({
          title: "Error",
          description: "Could not fetch available time slots. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUnavailableSlots();
  }, [date, toast]);

  const validateTimeSlot = async (selectedDate: Date, selectedTime: string) => {
    const { data, error } = await supabase
      .from('interviews')
      .select('id')
      .eq('scheduled_at', format(selectedDate, 'yyyy-MM-dd') + ' ' + selectedTime)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!date || !time) {
      setError("Please select both date and time for the interview");
      return;
    }

    setIsSubmitting(true);

    const scheduleInterview = async () => {
      try {
        // Validate time slot availability
        const isAvailable = await validateTimeSlot(date, time);
        if (!isAvailable) {
          throw new Error("This time slot is no longer available");
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user");

        const scheduledAt = new Date(date);
        const [hours, minutes] = time.split(":");
        scheduledAt.setHours(parseInt(hours), parseInt(minutes));

        const { error: insertError } = await supabase
          .from('interviews')
          .insert({
            candidate_id: candidateId,
            interviewer_id: user.id,
            scheduled_at: scheduledAt.toISOString(),
            status: 'scheduled',
            notes,
          });

        if (insertError) throw insertError;

        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['interviews'] });
        queryClient.invalidateQueries({ queryKey: ['candidates'] });

        toast({
          title: "Interview scheduled",
          description: `Interview scheduled with ${candidateName} for ${format(scheduledAt, 'PPP p')}`,
        });

        onOpenChange(false);
        setDate(undefined);
        setTime("");
        setNotes("");
        setRetryCount(0);
      } catch (error) {
        console.error('Error scheduling interview:', error);
        
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          setError(`Scheduling failed. Retrying... (Attempt ${retryCount + 1}/${maxRetries})`);
          setTimeout(scheduleInterview, 1000 * (retryCount + 1));
        } else {
          setError("Failed to schedule interview. Please try again later.");
          toast({
            title: "Error",
            description: "Could not schedule interview after multiple attempts",
            variant: "destructive",
          });
        }
      }
    };

    await scheduleInterview();
    setIsSubmitting(false);
  };

  const isTimeSlotUnavailable = (timeToCheck: string) => {
    return unavailableSlots.includes(timeToCheck);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview with {candidateName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={isTimeSlotUnavailable(time) ? "bg-gray-100" : ""}
              disabled={isTimeSlotUnavailable(time)}
            />
            {isTimeSlotUnavailable(time) && (
              <p className="text-sm text-red-500">This time slot is not available</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Add any notes about the interview..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !date || !time || isTimeSlotUnavailable(time)} 
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : 'Scheduling...'}
              </>
            ) : (
              'Schedule Interview'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}