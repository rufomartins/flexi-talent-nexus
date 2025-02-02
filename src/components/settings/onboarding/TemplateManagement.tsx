import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Template {
  id: string;
  name: string;
  subject?: string;
  body?: string;
  message?: string;
  is_active: boolean;
}

interface TemplateFormProps {
  type: 'email' | 'sms';
  template?: Template;
  onClose: () => void;
}

function TemplateForm({ type, template, onClose }: TemplateFormProps) {
  const [name, setName] = useState(template?.name || '');
  const [subject, setSubject] = useState(template?.subject || '');
  const [content, setContent] = useState(template?.body || template?.message || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const table = type === 'email' ? 'onboarding_email_templates' : 'onboarding_sms_templates';
      const { error } = await supabase
        .from(table)
        .upsert({
          id: template?.id,
          name,
          ...(type === 'email' ? { subject, body: content } : { message: content }),
          is_active: true,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}-templates`] });
      toast({
        title: "Success",
        description: `Template ${template ? 'updated' : 'created'} successfully`,
      });
      onClose();
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
    <div className="space-y-4">
      <Input
        label="Template Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter template name"
      />
      {type === 'email' && (
        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      )}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {type === 'email' ? 'Email Body' : 'Message'}
        </label>
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setContent(prev => prev + '{First Name}')}
          >
            Add First Name
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setContent(prev => prev + '{Last Name}')}
          >
            Add Last Name
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setContent(prev => prev + '{Full Name}')}
          >
            Add Full Name
          </Button>
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Enter ${type} content`}
          className="min-h-[200px]"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : template ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
}

function TemplateList({ type }: { type: 'email' | 'sms' }) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: [`${type}-templates`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type === 'email' ? 'onboarding_email_templates' : 'onboarding_sms_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(type === 'email' ? 'onboarding_email_templates' : 'onboarding_sms_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${type}-templates`] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
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

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {type === 'email' ? 'Email Templates' : 'SMS Templates'}
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedTemplate(undefined)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
            </DialogHeader>
            <TemplateForm
              type={type}
              template={selectedTemplate}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {templates.map((template: Template) => (
          <Card key={template.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-medium">{template.name}</h4>
                {type === 'email' && (
                  <p className="text-sm text-muted-foreground">
                    Subject: {template.subject}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {type === 'email' ? template.body : template.message}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(template.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TemplateManagement() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Template Management</h3>
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <TemplateList type="email" />
        </TabsContent>
        <TabsContent value="sms">
          <TemplateList type="sms" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}