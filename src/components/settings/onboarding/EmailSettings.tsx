
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { EmailSenderConfig } from "@/types/onboarding";

interface CloudMailinSettings {
  enabled: boolean;
  module: 'onboarding';
}

export function EmailSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [enableReceiving, setEnableReceiving] = useState(false);

  // Query email sender settings
  const { data: settings, isLoading: isLoadingSenderSettings } = useQuery({
    queryKey: ['email-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .order('stage');

      if (error) throw error;
      return data as EmailSenderConfig[];
    }
  });

  // Query CloudMailin settings
  const { data: cloudMailinSettings, isLoading: isLoadingCloudMailin } = useQuery({
    queryKey: ['cloudmailin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_settings')
        .select('value')
        .eq('name', 'cloudmailin_settings')
        .maybeSingle();

      if (error) throw error;
      return (data?.value || { enabled: false, module: 'onboarding' }) as CloudMailinSettings;
    }
  });

  // Update enableReceiving state when cloudMailinSettings changes
  useEffect(() => {
    if (cloudMailinSettings) {
      setEnableReceiving(cloudMailinSettings.enabled);
    }
  }, [cloudMailinSettings]);

  const updateSetting = useMutation({
    mutationFn: async (setting: Partial<EmailSenderConfig> & { id: string }) => {
      const { error } = await supabase
        .from('email_settings')
        .update(setting)
        .eq('id', setting.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-settings'] });
      toast({
        title: "Success",
        description: "Email settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update email settings",
        variant: "destructive",
      });
    }
  });

  const toggleReceiving = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('api_settings')
        .update({ 
          value: { 
            enabled: checked,
            module: 'onboarding'
          } as CloudMailinSettings
        })
        .eq('name', 'cloudmailin_settings');

      if (error) throw error;

      setEnableReceiving(checked);
      queryClient.invalidateQueries({ queryKey: ['cloudmailin-settings'] });

      toast({
        title: "Success",
        description: `Email receiving ${checked ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email receiving settings",
        variant: "destructive",
      });
      // Revert the toggle if there was an error
      setEnableReceiving(!checked);
    }
  };

  if (isLoadingSenderSettings || isLoadingCloudMailin) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground">
          Loading email settings...
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Email Configuration</h3>
        
        <div className="space-y-4">
          {settings?.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <Label>{setting.stage === 'default' ? 'Default Sender Email' : `${setting.stage} Sender Email`}</Label>
              <div className="flex gap-2">
                <Input
                  value={setting.sender_email}
                  onChange={(e) => updateSetting.mutate({
                    id: setting.id,
                    sender_email: e.target.value
                  })}
                  placeholder="sender@yourdomain.com"
                />
                <Switch
                  checked={setting.is_active}
                  onCheckedChange={(checked) => updateSetting.mutate({
                    id: setting.id,
                    is_active: checked
                  })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center space-x-2">
          <Switch
            id="enable-receiving"
            checked={enableReceiving}
            onCheckedChange={toggleReceiving}
          />
          <Label htmlFor="enable-receiving">Enable Email Receiving (CloudMailin)</Label>
        </div>
      </div>
    </Card>
  );
}
