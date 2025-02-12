
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
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
    <Card className="w-full">
      <div className="space-y-4 p-6">
        <h3 className="text-lg font-medium">CloudMailin Setup</h3>
        <p className="text-sm text-muted-foreground">
          Generate and copy your CloudMailin webhook URL with embedded credentials.
        </p>
        
        <div className="flex flex-col space-y-4">
          <Button
            onClick={getCloudMailinUrl}
            disabled={loading}
            className="w-fit"
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
    </Card>
  );
}
