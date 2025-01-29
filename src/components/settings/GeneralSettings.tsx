import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function GeneralSettings() {
  const { toast } = useToast();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('role');
      
      if (error) throw error;
      return data;
    }
  });

  const handleTogglePermission = async (roleId: string, permission: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          role_id: roleId,
          permission_key: permission,
          enabled
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
        <h3 className="text-lg font-medium mb-4">Role Permissions</h3>
        
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="space-y-4">
              <h4 className="font-medium capitalize">{role.role}</h4>
              
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${role.id}-view-dashboard`}>
                    View Dashboard
                  </Label>
                  <Switch
                    id={`${role.id}-view-dashboard`}
                    onCheckedChange={(checked) => 
                      handleTogglePermission(role.id, 'view_dashboard', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor={`${role.id}-manage-users`}>
                    Manage Users
                  </Label>
                  <Switch
                    id={`${role.id}-manage-users`}
                    onCheckedChange={(checked) => 
                      handleTogglePermission(role.id, 'manage_users', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor={`${role.id}-view-reports`}>
                    View Reports
                  </Label>
                  <Switch
                    id={`${role.id}-view-reports`}
                    onCheckedChange={(checked) => 
                      handleTogglePermission(role.id, 'view_reports', checked)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
    </div>
  );
}