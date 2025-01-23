import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AgoraSettings {
  app_id: string;
  token_url: string;
  enabled: boolean;
}

export function AgoraSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["agora-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_settings")
        .select("*")
        .eq("name", "agora_settings")
        .single();

      if (error) throw error;
      return data?.value as AgoraSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: AgoraSettings) => {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("api_settings")
        .upsert({ 
          name: "agora_settings",
          value: newSettings,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agora-settings"] });
      toast({
        title: "Settings updated",
        description: "Agora settings have been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update Agora settings",
        variant: "destructive",
      });
      console.error("Error updating Agora settings:", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agora API Settings</CardTitle>
        <CardDescription>
          Configure your Agora integration settings for real-time messaging and communication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-id">App ID</Label>
            <Input
              id="app-id"
              value={settings?.app_id || ""}
              onChange={(e) =>
                updateSettings.mutate({
                  ...settings,
                  app_id: e.target.value,
                })
              }
              placeholder="Enter your Agora App ID"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token-url">Token Generator URL (Optional)</Label>
            <Input
              id="token-url"
              value={settings?.token_url || ""}
              onChange={(e) =>
                updateSettings.mutate({
                  ...settings,
                  token_url: e.target.value,
                })
              }
              placeholder="Enter your token generator URL"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Agora Integration</Label>
            <Switch
              id="enabled"
              checked={settings?.enabled}
              onCheckedChange={(checked) =>
                updateSettings.mutate({
                  ...settings,
                  enabled: checked,
                })
              }
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["agora-settings"] })}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}