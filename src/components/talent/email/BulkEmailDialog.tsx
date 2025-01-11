import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailEditor } from "@/components/email-templates/EmailEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TalentProfile, EmailTemplate } from "@/types/talent";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface BulkEmailDialogProps {
  selectedTalents: TalentProfile[];
  isOpen: boolean;
  onClose: () => void;
}

const emailSchema = z.object({
  templateId: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Email body is required"),
});

export function BulkEmailDialog({ selectedTalents, isOpen, onClose }: BulkEmailDialogProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  const loadTemplates = async () => {
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
      return;
    }

    setTemplates(data as EmailTemplate[]);
  };

  const handleTemplateChange = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      form.setValue('subject', template.subject);
      form.setValue('body', template.body);
      form.setValue('templateId', templateId);
    }
  };

  const replaceVariables = (text: string, talent: TalentProfile) => {
    return text
      .replace(/{{talent_name}}/g, talent.users.full_name)
      .replace(/{{talent_category}}/g, talent.talent_category);
  };

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      await Promise.all(selectedTalents.map(async (talent) => {
        const personalizedSubject = replaceVariables(values.subject, talent);
        const personalizedBody = replaceVariables(values.body, talent);

        const { error } = await supabase.functions.invoke('handle-booking-email', {
          body: {
            emailData: {
              template_id: values.templateId,
              recipient: {
                email: talent.users.email,
                name: talent.users.full_name,
              },
              subject: personalizedSubject,
              body: personalizedBody,
            },
          },
        });

        if (error) throw error;
      }));

      toast({
        title: "Success",
        description: `Emails sent to ${selectedTalents.length} talents`,
      });

      onClose();
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error sending emails",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Send Bulk Email</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Recipients ({selectedTalents.length})</h4>
          <ScrollArea className="h-20">
            <div className="flex flex-wrap gap-2">
              {selectedTalents.map((talent) => (
                <Badge key={talent.id} variant="secondary">
                  {talent.users.full_name}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template (Optional)</FormLabel>
                  <Select onValueChange={(value) => handleTemplateChange(value)} value={field.value}>
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

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Body</FormLabel>
                  <FormControl>
                    <EmailEditor 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  `Send to ${selectedTalents.length} talents`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
