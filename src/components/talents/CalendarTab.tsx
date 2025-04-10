
import { useState } from "react";
import { TalentProfileData } from "@/types/talent-profile";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface CalendarTabProps {
  talent: TalentProfileData;
}

export const CalendarTab = ({ talent }: CalendarTabProps) => {
  const { toast } = useToast();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [description, setDescription] = useState("");
  const [isUnavailable, setIsUnavailable] = useState(false);
  
  // Fetch talent's calendar events
  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["talent-calendar", talent.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_calendar")
        .select("*")
        .eq("talent_id", talent.user.id);

      if (error) throw error;
      return data || [];
    },
  });

  const addCalendarEvent = async () => {
    if (!date || !description) {
      toast({
        title: "Missing information",
        description: "Please provide both a date and description.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("talent_calendar")
        .insert({
          talent_id: talent.user.id,
          date: format(date, "yyyy-MM-dd"),
          description,
        });

      if (error) throw error;

      toast({
        title: "Event added",
        description: "Calendar event has been added successfully.",
      });
      setIsAddEventOpen(false);
      setDescription("");
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add calendar event",
        variant: "destructive",
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("talent_calendar")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast({
        title: "Event deleted",
        description: "Calendar event has been deleted successfully.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete calendar event",
        variant: "destructive",
      });
    }
  };

  // Transform events for calendar highlighting
  const highlightedDates = events?.map(event => new Date(event.date)) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Talent Calendar</h2>
        <Button onClick={() => setIsAddEventOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Date
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow"
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            modifiers={{
              booked: highlightedDates,
            }}
            modifiersStyles={{
              booked: { 
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderColor: 'rgba(220, 38, 38, 0.5)' 
              }
            }}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Scheduled Dates</h3>
          {isLoading ? (
            <div className="text-muted-foreground">Loading calendar events...</div>
          ) : events && events.length > 0 ? (
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(event.date), "MMMM d, yyyy")}
                    </div>
                    <div className="text-muted-foreground text-sm">{event.description}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => deleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No scheduled dates for this talent.</p>
              <Button 
                variant="link" 
                onClick={() => setIsAddEventOpen(true)}
              >
                Add a date
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Calendar Date</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="flex gap-2">
                <Input
                  id="date"
                  value={date ? format(date, "yyyy-MM-dd") : ""}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsAddEventOpen(true)}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter details about this date"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="unavailable"
                checked={isUnavailable}
                onCheckedChange={setIsUnavailable}
              />
              <Label htmlFor="unavailable">Mark talent as unavailable for this period</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCalendarEvent}>Add Date</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
