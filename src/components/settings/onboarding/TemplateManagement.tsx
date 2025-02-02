import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TemplateType = "welcome" | "interview_scheduled" | "interview_reminder" | "approval" | "rejection";

interface Template {
  id: string;
  name: string;
  type: TemplateType;
  subject?: string;
  body?: string;
  message?: string;
  is_active: boolean;
  variables?: string[];
  created_at: string;
  updated_at: string;
}

export function TemplateManagement() {
  const [selectedType, setSelectedType] = useState<TemplateType>("welcome");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: emailTemplates, isLoading: emailLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
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
      return data;
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Partial<Template>) => {
      const table = template.message ? 'onboarding_sms_templates' : 'onboarding_email_templates';
      const { data, error } = await supabase
        .from(table)
        .insert([{
          ...template,
          type: selectedType,
          is_active: true,
          variables: ['First Name', 'Last Name', 'Full Name']
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      queryClient.invalidateQueries({ queryKey: ['sms-templates'] });
      toast({
        title: "Success",
        description: "Template created successfully",
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
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
        </TabsList>

        <div className="mb-4">
          <Label>Template Type</Label>
          <Select value={selectedType} onValueChange={(value: TemplateType) => setSelectedType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select template type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Welcome</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="interview_reminder">Interview Reminder</SelectItem>
              <SelectItem value="approval">Approval</SelectItem>
              <SelectItem value="rejection">Rejection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="email" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="Enter template name"
                onChange={(e) => {/* Handle change */}}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                onChange={(e) => {/* Handle change */}}
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
                onChange={(e) => {/* Handle change */}}
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
                onChange={(e) => {/* Handle change */}}
              />
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
                onChange={(e) => {/* Handle change */}}
              />
            </div>
          </div>
        </TabsContent>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => createTemplateMutation.mutate({
            name: "New Template",
            type: selectedType,
          })}>
            Save Template
          </Button>
        </div>
      </Tabs>
    </Card>
  );
}