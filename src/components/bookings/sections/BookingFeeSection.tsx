import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../types";

interface BookingFeeSectionProps {
  form: UseFormReturn<BookingFormData>;
}

export function BookingFeeSection({ form }: BookingFeeSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Fee Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="talent_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Talent Fee</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="final_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Final Fee (Admin Only)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}