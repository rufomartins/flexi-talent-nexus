import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast({
        title: "Missing information",
        description: "Please select both date and time for the interview",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const scheduledAt = new Date(date);
      const [hours, minutes] = time.split(":");
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('interviews')
        .insert({
          candidate_id: candidateId,
          interviewer_id: user.id,
          scheduled_at: scheduledAt.toISOString(),
          status: 'scheduled',
          notes,
        });

      if (error) throw error;

      toast({
        title: "Interview scheduled",
        description: `Interview scheduled with ${candidateName}`,
      });

      onOpenChange(false);
      setDate(undefined);
      setTime("");
      setNotes("");
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview with {candidateName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              placeholder="Add any notes about the interview..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
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