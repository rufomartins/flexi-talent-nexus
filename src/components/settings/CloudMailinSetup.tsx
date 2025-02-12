
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy } from "lucide-react";

export function CloudMailinSetup() {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="forward-email-enabled">Enable CloudMailin Integration</Label>
        <Switch
          id="forward-email-enabled"
          checked={getSettingValue('cloudmailin_settings')?.enabled ?? false}
          onCheckedChange={(checked) => {
            const currentValue = getSettingValue('cloudmailin_settings');
            updateSettings.mutate({
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
    </div>
  );
}
