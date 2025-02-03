import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EmailTemplate, SmsTemplate, TemplateType } from "@/types/onboarding";

export function TemplateManagement() {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: emailTemplates, isLoading: emailLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
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

      if (error) throw error;
      return data as SmsTemplate[];
    }
  });

  const createEmailTemplate = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id'>) => {
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: "Success",
        description: "Email template created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const createSmsTemplate = useMutation({
    mutationFn: async (template: Omit<SmsTemplate, 'id'>) => {
      const { data, error } = await supabase
        .from('onboarding_sms_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-templates'] });
      toast({
        title: "Success",
        description: "SMS template created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Template Management</h3>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "sms")}>
        <TabsList>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="type">Template Type</Label>
              <select
                id="type"
                className="w-full p-2 border rounded"
                defaultValue="welcome"
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
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle click */}}
                >
                  Add First Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle click */}}
                >
                  Add Last Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle click */}}
                >
                  Add Full Name
                </Button>
              </div>
              <Textarea
                id="body"
                placeholder="Type your message here..."
                className="min-h-[200px]"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sms-name">Template Name</Label>
              <Input
                id="sms-name"
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="sms-type">Template Type</Label>
              <select
                id="sms-type"
                className="w-full p-2 border rounded"
                defaultValue="welcome"
              >
                <option value="welcome">Welcome</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_reminder">Interview Reminder</option>
                <option value="approval">Approval</option>
                <option value="rejection">Rejection</option>
              </select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle click */}}
                >
                  Add First Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle click */}}
                >
                  Add Last Name
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle click */}}
                >
                  Add Full Name
                </Button>
              </div>
              <Textarea
                id="message"
                placeholder="Type your SMS message here..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}