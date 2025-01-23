import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../types";

interface BookingEmailPreviewProps {
  form: UseFormReturn<BookingFormData>;
  emailTemplates?: { id: string; name: string }[];
}

export function BookingEmailPreview({ form, emailTemplates = [] }: BookingEmailPreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Email Template</h3>
      <FormField
        control={form.control}
        name="email_template_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Template</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}