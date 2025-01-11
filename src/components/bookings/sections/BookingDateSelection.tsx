import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { BookingFormData } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { checkTalentAvailability, TalentAvailability } from "@/utils/availability";

interface BookingDateSelectionProps {
  form: UseFormReturn<BookingFormData>;
  talentId: string;
  onAvailabilityChange?: (availability: TalentAvailability) => void;
}

export function BookingDateSelection({ form, talentId, onAvailabilityChange }: BookingDateSelectionProps) {
  const [availability, setAvailability] = useState<TalentAvailability | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      const startDate = form.getValues("start_date");
      const endDate = form.getValues("end_date");

      if (startDate && endDate && talentId) {
        setIsChecking(true);
        try {
          const result = await checkTalentAvailability(talentId, startDate, endDate);
          setAvailability(result);
          onAvailabilityChange?.(result);
        } catch (error) {
          console.error("Error checking availability:", error);
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkAvailability();
  }, [form.watch("start_date"), form.watch("end_date"), talentId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Booking Dates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="date"
                    {...field}
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                  <Calendar className="ml-2 h-4 w-4 text-gray-500" />
                  {!isChecking && availability && !availability.is_available && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Date conflicts with existing bookings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="date"
                    {...field}
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                  <Calendar className="ml-2 h-4 w-4 text-gray-500" />
                  {!isChecking && availability && !availability.is_available && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Date conflicts with existing bookings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}