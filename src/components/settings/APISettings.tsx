import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { APIConfigs } from "@/types/api-settings";

interface APISettingRecord {
  name: string;
  value: any;
}

export function APISettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [testLoading, setTestLoading] = useState(false);

  // Fetch API settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['api-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_settings')
        .select('*');

      if (error) throw error;
      return data as APISettingRecord[];
    }
  });

  // Update API settings
  const updateSettings = useMutation({
    mutationFn: async ({ name, value }: { name: string; value: any }) => {
      const { error } = await supabase
        .from('api_settings')
        .upsert({ name, value })
        .eq('name', name);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-settings'] });
      toast({
        title: "Settings updated",
        description: "API settings have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating API settings:', error);
      toast({
        title: "Error",
        description: "Failed to update API settings",
        variant: "destructive",
      });
    }
  });

  const testEmail = async () => {
    setTestLoading(true);
    try {
      const { error } = await supabase.functions.invoke('test-inbound-email');

      if (error) throw error;

      toast({
        title: "Test email sent",
        description: "Check your inbox for the test email",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const getSettingValue = <T extends keyof APIConfigs>(name: T): APIConfigs[T] => {
    const setting = settings?.find(s => s.name === name);
    return setting?.value || {};
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email API Settings</CardTitle>
          <CardDescription>
            Configure your email communication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6">
            {/* Resend Settings */}
            <div className="space-y-4">
              <div className="font-medium">Resend (Outbound Email)</div>
              <div className="flex items-center justify-between">
                <Label htmlFor="resend-enabled">Enable Resend Integration</Label>
                <Switch
                  id="resend-enabled"
                  checked={getSettingValue('resend_settings').enabled ?? false}
                  onCheckedChange={(checked) => {
                    const currentValue = getSettingValue('resend_settings');
                    updateSettings.mutate({
                      name: 'resend_settings',
                      value: { ...currentValue, enabled: checked }
                    });
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resend-api-key">API Key</Label>
                <Input
                  id="resend-api-key"
                  type="password"
                  value={getSettingValue('resend_settings').api_key || ''}
                  onChange={(e) => {
                    const currentValue = getSettingValue('resend_settings');
                    updateSettings.mutate({
                      name: 'resend_settings',
                      value: { ...currentValue, api_key: e.target.value }
                    });
                  }}
                  placeholder="Enter your Resend API key"
                />
              </div>

              <Button 
                onClick={testEmail} 
                disabled={testLoading}
                variant="outline"
              >
                {testLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test Email Configuration
              </Button>
            </div>

            {/* Forward Email Settings */}
            <div className="space-y-4">
              <div className="font-medium">Forward Email (Inbound Email)</div>
              <div className="flex items-center justify-between">
                <Label htmlFor="forward-email-enabled">Enable Forward Email Integration</Label>
                <Switch
                  id="forward-email-enabled"
                  checked={getSettingValue('forward_email_settings').enabled ?? false}
                  onCheckedChange={(checked) => {
                    const currentValue = getSettingValue('forward_email_settings');
                    updateSettings.mutate({
                      name: 'forward_email_settings',
                      value: { ...currentValue, enabled: checked }
                    });
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="forward-email-webhook-key">Webhook Signature Key</Label>
                <Input
                  id="forward-email-webhook-key"
                  type="password"
                  value={getSettingValue('forward_email_settings').webhook_signature_key || ''}
                  onChange={(e) => {
                    const currentValue = getSettingValue('forward_email_settings');
                    updateSettings.mutate({
                      name: 'forward_email_settings',
                      value: { ...currentValue, webhook_signature_key: e.target.value }
                    });
                  }}
                  placeholder="Enter your Forward Email webhook signature key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="forward-email-domain">Webhook Domain</Label>
                <Input
                  id="forward-email-domain"
                  value="onboarding.gtmd.studio"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="forward-email-webhook-url">Webhook URL</Label>
                <Input
                  id="forward-email-webhook-url"
                  value="https://uqanisnpgfgrxnlvpqss.supabase.co/functions/v1/handle-inbound-email"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS API Settings (Twilio)</CardTitle>
          <CardDescription>
            Configure your Twilio API settings for SMS communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="onboarding">
            <TabsList>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="casting">Casting</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
            </TabsList>

            {['onboarding', 'casting', 'booking'].map((module) => (
              <TabsContent key={module} value={module} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`twilio-enabled-${module}`}>Enable Twilio for {module}</Label>
                  <Switch
                    id={`twilio-enabled-${module}`}
                    checked={settings?.find(s => s.name === `${module}_twilio_credentials`)?.value?.enabled ?? false}
                    onCheckedChange={(checked) => {
                      const currentValue = settings?.find(s => s.name === `${module}_twilio_credentials`)?.value || {};
                      updateSettings.mutate({
                        name: `${module}_twilio_credentials`,
                        value: { ...currentValue, enabled: checked }
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`account-sid-${module}`}>Account SID</Label>
                  <Input
                    id={`account-sid-${module}`}
                    type="password"
                    value={settings?.find(s => s.name === `${module}_twilio_credentials`)?.value?.account_sid || ''}
                    onChange={(e) => {
                      const currentValue = settings?.find(s => s.name === `${module}_twilio_credentials`)?.value || {};
                      updateSettings.mutate({
                        name: `${module}_twilio_credentials`,
                        value: { ...currentValue, account_sid: e.target.value }
                      });
                    }}
                    placeholder="Enter your Twilio Account SID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`auth-token-${module}`}>Auth Token</Label>
                  <Input
                    id={`auth-token-${module}`}
                    type="password"
                    value={settings?.find(s => s.name === `${module}_twilio_credentials`)?.value?.auth_token || ''}
                    onChange={(e) => {
                      const currentValue = settings?.find(s => s.name === `${module}_twilio_credentials`)?.value || {};
                      updateSettings.mutate({
                        name: `${module}_twilio_credentials`,
                        value: { ...currentValue, auth_token: e.target.value }
                      });
                    }}
                    placeholder="Enter your Twilio Auth Token"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`phone-number-${module}`}>Phone Number</Label>
                  <Input
                    id={`phone-number-${module}`}
                    value={settings?.find(s => s.name === `${module}_twilio_credentials`)?.value?.phone_number || ''}
                    onChange={(e) => {
                      const currentValue = settings?.find(s => s.name === `${module}_twilio_credentials`)?.value || {};
                      updateSettings.mutate({
                        name: `${module}_twilio_credentials`,
                        value: { ...currentValue, phone_number: e.target.value }
                      });
                    }}
                    placeholder="Enter your Twilio Phone Number"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Storage API Settings (Cloudin)</CardTitle>
          <CardDescription>
            Configure your Cloudin storage settings for file management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cloudin-enabled">Enable Cloudin Integration</Label>
            <Switch
              id="cloudin-enabled"
              checked={settings?.find(s => s.name === 'cloudin_settings')?.value?.enabled ?? false}
              onCheckedChange={(checked) => {
                const currentValue = settings?.find(s => s.name === 'cloudin_settings')?.value || {};
                updateSettings.mutate({
                  name: 'cloudin_settings',
                  value: { ...currentValue, enabled: checked }
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cloudin-api-key">API Key</Label>
            <Input
              id="cloudin-api-key"
              type="password"
              value={settings?.find(s => s.name === 'cloudin_settings')?.value?.api_key || ''}
              onChange={(e) => {
                const currentValue = settings?.find(s => s.name === 'cloudin_settings')?.value || {};
                updateSettings.mutate({
                  name: 'cloudin_settings',
                  value: { ...currentValue, api_key: e.target.value }
                });
              }}
              placeholder="Enter your Cloudin API key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cloudin-bucket">Storage Bucket</Label>
            <Input
              id="cloudin-bucket"
              value={settings?.find(s => s.name === 'cloudin_settings')?.value?.bucket || ''}
              onChange={(e) => {
                const currentValue = settings?.find(s => s.name === 'cloudin_settings')?.value || {};
                updateSettings.mutate({
                  name: 'cloudin_settings',
                  value: { ...currentValue, bucket: e.target.value }
                });
              }}
              placeholder="Enter your storage bucket name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cloudin-region">Region</Label>
            <Input
              id="cloudin-region"
              value={settings?.find(s => s.name === 'cloudin_settings')?.value?.region || ''}
              onChange={(e) => {
                const currentValue = settings?.find(s => s.name === 'cloudin_settings')?.value || {};
                updateSettings.mutate({
                  name: 'cloudin_settings',
                  value: { ...currentValue, region: e.target.value }
                });
              }}
              placeholder="Enter your preferred region"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video/Audio API Settings (Agora)</CardTitle>
          <CardDescription>
            Configure your Agora settings for real-time video and audio communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="agora-enabled">Enable Agora Integration</Label>
            <Switch
              id="agora-enabled"
              checked={settings?.find(s => s.name === 'agora_settings')?.value?.enabled ?? false}
              onCheckedChange={(checked) => {
                const currentValue = settings?.find(s => s.name === 'agora_settings')?.value || {};
                updateSettings.mutate({
                  name: 'agora_settings',
                  value: { ...currentValue, enabled: checked }
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agora-app-id">App ID</Label>
            <Input
              id="agora-app-id"
              type="password"
              value={settings?.find(s => s.name === 'agora_settings')?.value?.app_id || ''}
              onChange={(e) => {
                const currentValue = settings?.find(s => s.name === 'agora_settings')?.value || {};
                updateSettings.mutate({
                  name: 'agora_settings',
                  value: { ...currentValue, app_id: e.target.value }
                });
              }}
              placeholder="Enter your Agora App ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agora-token-url">Token Generator URL (Optional)</Label>
            <Input
              id="agora-token-url"
              value={settings?.find(s => s.name === 'agora_settings')?.value?.token_url || ''}
              onChange={(e) => {
                const currentValue = settings?.find(s => s.name === 'agora_settings')?.value || {};
                updateSettings.mutate({
                  name: 'agora_settings',
                  value: { ...currentValue, token_url: e.target.value }
                });
              }}
              placeholder="Enter your token generator URL"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
