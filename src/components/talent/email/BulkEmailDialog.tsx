import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TalentProfile } from "@/types/talent";
import { Loader2 } from "lucide-react";
import { EmailRecipientList } from "./EmailRecipientList";
import { EmailTemplateSelector } from "./EmailTemplateSelector";
import { EmailComposer } from "./EmailComposer";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  const handleTemplateChange = async (templateId: string) => {
    const template = await loadTemplate(templateId);
    if (template) {
      form.setValue('subject', template.subject);
      form.setValue('body', template.body);
      form.setValue('templateId', templateId);
    }
  };

  const loadTemplate = async (templateId: string) => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      toast({
        title: "Error loading template",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return data;
  };

  const replaceVariables = (text: string, talent: TalentProfile) => {
    return text
      .replace(/{{talent_name}}/g, talent.users.full_name)
      .replace(/{{talent_category}}/g, talent.talent_category || '');
  };

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      const { data: emailData, error: emailError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .in('id', selectedTalents.map(t => t.user_id))
        .not('email', 'is', null);

      if (emailError) throw emailError;

      if (!emailData) {
        throw new Error('No email data found for selected talents');
      }

      const emailMap = new Map(emailData.map(d => [d.id, d.email]));

      await Promise.all(selectedTalents.map(async (talent) => {
        const email = emailMap.get(talent.user_id || '');
        if (!email) {
          console.warn(`No email found for talent ${talent.users.full_name}`);
          return;
        }

        const personalizedSubject = replaceVariables(values.subject, talent);
        const personalizedBody = replaceVariables(values.body, talent);

        const { error } = await supabase.functions.invoke('handle-booking-email', {
          body: {
            emailData: {
              template_id: values.templateId,
              recipient: {
                email,
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

        <EmailRecipientList selectedTalents={selectedTalents} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmailTemplateSelector 
              form={form} 
              onTemplateChange={handleTemplateChange}
            />

            <EmailComposer form={form} />

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