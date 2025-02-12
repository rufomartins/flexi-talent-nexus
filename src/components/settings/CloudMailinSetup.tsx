
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy } from "lucide-react";
import { APIConfigs } from "@/types/api-settings";

interface CloudMailinSetupProps {
  getSettingValue: <T extends keyof APIConfigs>(name: T) => APIConfigs[T];
  updateSettings: (data: { name: string; value: any }) => void;
}

export function CloudMailinSetup({ getSettingValue, updateSettings }: CloudMailinSetupProps) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCloudMailinUrl = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-cloudmailin-url');
      
      if (error) throw error;
      
      setUrl(data.url);
      toast({
        title: "Success",
        description: "CloudMailin URL generated successfully",
      });
    } catch (error) {
      console.error('Error getting CloudMailin URL:', error);
      toast({
        title: "Error",
        description: "Failed to get CloudMailin URL",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CloudMailin Setup</CardTitle>
        <CardDescription>
          Generate and copy your CloudMailin webhook URL with embedded credentials.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="cloudmailin-enabled">Enable CloudMailin Integration</Label>
          <Switch
            id="cloudmailin-enabled"
            checked={getSettingValue('cloudmailin_settings')?.enabled ?? false}
            onCheckedChange={(checked) => {
              const currentValue = getSettingValue('cloudmailin_settings');
              updateSettings({
                name: 'cloudmailin_settings',
                value: { ...currentValue, enabled: checked }
              });
            }}
          />
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={getCloudMailinUrl}
            disabled={loading}
            variant="outline"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate URL
          </Button>

          {url && (
            <div className="relative">
              <div className="rounded-md border bg-muted p-4 font-mono text-sm">
                {url}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
