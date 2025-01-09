import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";

interface AssignmentDeadlinesProps {
  assignmentId: string;
  startDate?: string;
  dueDate?: string;
}

export function AssignmentDeadlines({
  assignmentId,
  startDate,
  dueDate,
}: AssignmentDeadlinesProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(
    dueDate ? new Date(dueDate) : undefined
  );

  const handleSaveDeadlines = async () => {
    if (!newStartDate || !newDueDate) {
      notify.error("Both start and due dates are required");
      return;
    }

    setIsUpdating(true);
    const { error } = await supabase
      .from("role_assignments")
      .update({
        start_date: newStartDate.toISOString(),
        due_date: newDueDate.toISOString(),
        last_updated: new Date().toISOString(),
      })
      .eq("id", assignmentId);

    setIsUpdating(false);

    if (error) {
      notify.error("Failed to update deadlines");
      return;
    }

    notify.success("Deadlines updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !newStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newStartDate ? (
                  format(newStartDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newStartDate}
                onSelect={setNewStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !newDueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newDueDate ? format(newDueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newDueDate}
                onSelect={setNewDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button
        onClick={handleSaveDeadlines}
        disabled={isUpdating || !newStartDate || !newDueDate}
      >
        {isUpdating ? "Updating..." : "Update Deadlines"}
      </Button>
    </div>
  );
}