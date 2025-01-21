import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface OnboardingEmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCandidates: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

const formSchema = z.object({
  templateId: z.string().min(1, "Please select a template"),
});

export function OnboardingEmailComposer({ 
  open, 
  onOpenChange, 
  selectedCandidates 
}: OnboardingEmailComposerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Fetch available templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['onboarding-email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedCandidates.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one candidate",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-onboarding-email', {
        body: {
          emailData: {
            templateId: values.templateId,
            recipients: selectedCandidates,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Email${selectedCandidates.length > 1 ? 's' : ''} sent successfully`,
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Email to {selectedCandidates.length} Candidate{selectedCandidates.length > 1 ? 's' : ''}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates?.map((template) => (
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoadingTemplates}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Email{selectedCandidates.length > 1 ? 's' : ''}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}