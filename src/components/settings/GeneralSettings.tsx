import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface UserPermission {
  id: string;
  user_id: string;
  permission_key: string;
  created_at: string;
}

export function GeneralSettings() {
  const { toast } = useToast();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .order('permission_key');
      
      if (error) throw error;
      return data as UserPermission[];
    }
  });

  const handleTogglePermission = async (userId: string, permission: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission_key: permission,
        });

      if (error) throw error;

      toast({
        title: "Permission updated",
        description: "The permission has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error updating permission",
        description: "There was an error updating the permission.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Platform Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance-mode">
              Maintenance Mode
            </Label>
            <Switch id="maintenance-mode" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="debug-mode">
              Debug Mode
            </Label>
            <Switch id="debug-mode" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="two-factor">
              Two-Factor Authentication
            </Label>
            <Switch id="two-factor" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="session-timeout">
              Session Timeout
            </Label>
            <Switch id="session-timeout" />
          </div>
        </div>
      </Card>
    </div>
  );
}