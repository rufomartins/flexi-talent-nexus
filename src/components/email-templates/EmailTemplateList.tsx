import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OnboardingEmailTemplate } from "@/types/onboarding";

export function EmailTemplateList() {
  const { toast } = useToast();
  
  const { data: templates, isLoading, refetch } = useQuery({
    queryKey: ['onboarding-email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load email templates",
          variant: "destructive",
        });
        throw error;
      }

      return data as OnboardingEmailTemplate[];
    },
  });

  const toggleTemplateStatus = async (templateId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('onboarding_email_templates')
        .update({ is_active: !currentStatus })
        .eq('id', templateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Template ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update template status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates?.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.name}</TableCell>
              <TableCell>{template.type}</TableCell>
              <TableCell>{template.subject}</TableCell>
              <TableCell>{formatDate(template.updated_at)}</TableCell>
              <TableCell>
                <Switch 
                  checked={template.is_active}
                  onCheckedChange={() => toggleTemplateStatus(template.id, template.is_active)}
                />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
