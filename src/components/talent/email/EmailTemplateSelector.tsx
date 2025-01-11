import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailTemplate } from "@/types/talent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";

interface EmailTemplateSelectorProps {
  form: UseFormReturn<any>;
  onTemplateChange: (templateId: string) => void;
}

export const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({
  form,
  onTemplateChange
}) => {
  const { toast } = useToast();
  const { data: templates = [] } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true);

      if (error) {
        toast({
          title: "Error loading templates",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as EmailTemplate[];
    },
  });

  return (
    <FormField
      control={form.control}
      name="templateId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email Template (Optional)</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onTemplateChange(value);
            }} 
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};