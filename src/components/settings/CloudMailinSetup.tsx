
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { APIConfigs, CloudMailinSettings } from "@/types/api-settings";

interface CloudMailinSetupProps {
  getSettingValue: <T extends keyof APIConfigs>(name: T) => APIConfigs[T];
  updateSettings: (data: { name: string; value: any }) => void;
}

export function CloudMailinSetup({ getSettingValue, updateSettings }: CloudMailinSetupProps) {
  const { toast } = useToast();
  const settings = getSettingValue('cloudmailin_settings') as CloudMailinSettings;

  return (
    <Card>
      <CardHeader>
        <CardTitle>CloudMailin Setup</CardTitle>
        <CardDescription>
          Configure your CloudMailin webhook settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="cloudmailin-enabled">Enable CloudMailin Integration</Label>
          <Switch
            id="cloudmailin-enabled"
            checked={settings?.enabled ?? false}
            onCheckedChange={(checked) => {
              updateSettings({
                name: 'cloudmailin_settings',
                value: { ...settings, enabled: checked }
              });
              
              toast({
                title: checked ? "CloudMailin Enabled" : "CloudMailin Disabled",
                description: checked 
                  ? "Email integration has been enabled" 
                  : "Email integration has been disabled",
              });
            }}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Your CloudMailin webhook URL is already configured on your server at:
            <code className="ml-2 p-1 bg-muted rounded">https://onboarding.gtmd.studio:3000/webhook</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
