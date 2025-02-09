
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EmailTemplate, SmsTemplate, TemplateType } from "@/types/onboarding";

export function TemplateManagement() {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const [emailTemplate, setEmailTemplate] = useState({
    name: "",
    type: "welcome" as TemplateType,
    subject: "",
    message: "",
    variables: [] as string[],
    is_active: true
  });
  const [smsTemplate, setSmsTemplate] = useState({
    name: "",
    type: "welcome" as TemplateType,
    message: "",
    variables: [] as string[],
    is_active: true
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: emailTemplates, isLoading: emailLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching email templates:', error);
        toast({
          title: "Error",
          description: "Failed to fetch email templates",
          variant: "destructive",
        });
        throw error;
      }
      return data as EmailTemplate[];
    }
  });

  const { data: smsTemplates, isLoading: smsLoading } = useQuery({
    queryKey: ['sms-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_sms_templates')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching SMS templates:', error);
        toast({
          title: "Error",
          description: "Failed to fetch SMS templates",
          variant: "destructive",
        });
        throw error;
      }
      return data as SmsTemplate[];
    }
  });

  const createEmailTemplate = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id'>) => {
      console.log('Saving email template:', template);
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .insert([{
          name: template.name,
          type: template.type,
          subject: template.subject,
          message: template.message,
          variables: template.variables,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving email template:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: "Success",
        description: "Email template created successfully",
      });
      setEmailTemplate({
        name: "",
        type: "welcome",
        subject: "",
        message: "",
        variables: [],
        is_active: true
      });
    },
    onError: (error: any) => {
      console.error('Template creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create email template",
        variant: "destructive",
      });
    }
  });

  const createSmsTemplate = useMutation({
    mutationFn: async (template: Omit<SmsTemplate, 'id'>) => {
      console.log('Saving SMS template:', template);
      const { data, error } = await supabase
        .from('onboarding_sms_templates')
        .insert([{
          name: template.name,
          type: template.type,
          message: template.message,
          variables: template.variables,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving SMS template:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-templates'] });
      toast({
        title: "Success",
        description: "SMS template created successfully",
      });
      setSmsTemplate({
        name: "",
        type: "welcome",
        message: "",
        variables: [],
        is_active: true
      });
    },
    onError: (error: any) => {
      console.error('Template creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create SMS template",
        variant: "destructive",
      });
    }
  });

  const handleEmailTagInsert = (tag: string) => {
    const textarea = document.getElementById('email-message') as HTMLTextAreaElement;
    const cursorPosition = textarea?.selectionStart || emailTemplate.message.length;
    const tagText = tag === "?id={{Candidate ID}}" ? tag : `{{${tag}}}`;
    const newMessage = 
      emailTemplate.message.slice(0, cursorPosition) + 
      tagText + 
      emailTemplate.message.slice(cursorPosition);
    
    setEmailTemplate(prev => ({
      ...prev,
      message: newMessage
    }));
  };

  const handleSmsTagInsert = (tag: string) => {
    const tagText = `{{${tag}}}`;
    setSmsTemplate(prev => ({
      ...prev,
      message: prev.message + tagText
    }));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTemplate.name || !emailTemplate.subject || !emailTemplate.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createEmailTemplate.mutate(emailTemplate);
  };

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsTemplate.name || !smsTemplate.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createSmsTemplate.mutate(smsTemplate);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Template Management</h3>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "sms")}>
        <TabsList>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={emailTemplate.name}
                onChange={(e) => setEmailTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="type">Template Type</Label>
              <select
                id="type"
                className="w-full p-2 border rounded"
                value={emailTemplate.type}
                onChange={(e) => setEmailTemplate(prev => ({ ...prev, type: e.target.value as TemplateType }))}
              >
                <option value="welcome">Welcome</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_reminder">Interview Reminder</option>
                <option value="approval">Approval</option>
                <option value="rejection">Rejection</option>
              </select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailTemplate.subject}
                onChange={(e) => setEmailTemplate(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmailTagInsert("First Name")}
                >
                  Add First Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmailTagInsert("Last Name")}
                >
                  Add Last Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmailTagInsert("Full Name")}
                >
                  Add Full Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmailTagInsert("Candidate ID")}
                >
                  Add Candidate ID
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmailTagInsert("?id={{Candidate ID}}")}
                >
                  Add ID Parameter
                </Button>
              </div>
              <Textarea
                id="email-message"
                value={emailTemplate.message}
                onChange={(e) => setEmailTemplate(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your email message here..."
                className="min-h-[200px]"
              />
            </div>
            <Button type="submit">Save Email Template</Button>
          </form>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <form onSubmit={handleSmsSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sms-name">Template Name</Label>
              <Input
                id="sms-name"
                value={smsTemplate.name}
                onChange={(e) => setSmsTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="sms-type">Template Type</Label>
              <select
                id="sms-type"
                className="w-full p-2 border rounded"
                value={smsTemplate.type}
                onChange={(e) => setSmsTemplate(prev => ({ ...prev, type: e.target.value as TemplateType }))}
              >
                <option value="welcome">Welcome</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_reminder">Interview Reminder</option>
                <option value="approval">Approval</option>
                <option value="rejection">Rejection</option>
              </select>
            </div>
            <div>
              <Label htmlFor="sms-message">Message</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSmsTagInsert("First Name")}
                >
                  Add First Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSmsTagInsert("Last Name")}
                >
                  Add Last Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSmsTagInsert("Full Name")}
                >
                  Add Full Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSmsTagInsert("Candidate ID")}
                >
                  Add Candidate ID
                </Button>
              </div>
              <Textarea
                id="sms-message"
                value={smsTemplate.message}
                onChange={(e) => setSmsTemplate(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Type your SMS message here..."
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit">Save SMS Template</Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
