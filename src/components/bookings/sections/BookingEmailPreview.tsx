import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingEmailPreviewProps {
  form: UseFormReturn<BookingFormData>;
}

export function BookingEmailPreview({ form }: BookingEmailPreviewProps) {
  const { data: emailTemplates, isLoading: loadingTemplates } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .eq("type", "booking_confirmation")
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Email Configuration</h3>
      <FormField
        control={form.control}
        name="email_template_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Template</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {loadingTemplates ? (
                  <SelectItem value="loading" disabled>
                    Loading templates...
                  </SelectItem>
                ) : (
                  emailTemplates?.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}