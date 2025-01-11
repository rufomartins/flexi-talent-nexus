import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../types";

interface BookingProjectDetailsProps {
  form: UseFormReturn<BookingFormData>;
}

export function BookingProjectDetails({ form }: BookingProjectDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Details</h3>
      <FormField
        control={form.control}
        name="project_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="project_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Details</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}