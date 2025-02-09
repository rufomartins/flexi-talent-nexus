
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TemplateManagement } from "./onboarding/TemplateManagement";
import { EmailSettings } from "./onboarding/EmailSettings";

interface VideoSettings {
  url: string;
  embed_code: string;
}

export function OnboardingSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videoSettings } = useQuery({
    queryKey: ['onboarding-settings', 'welcome_video'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('onboarding_settings')
        .select('value')
        .eq('feature_key', 'welcome_video')
        .single();

      if (error) throw error;
      return data?.value as VideoSettings;
    }
  });

  const updateVideoSettings = useMutation({
    mutationFn: async (newSettings: VideoSettings) => {
      const { error } = await supabase
        .from('onboarding_settings')
        .update({ value: newSettings })
        .eq('feature_key', 'welcome_video');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-settings', 'welcome_video'] });
      toast({
        title: "Settings saved",
        description: "Welcome video settings have been updated successfully."
      });
    },
    onError: (error) => {
      console.error('Error saving video settings:', error);
      toast({
        title: "Error",
        description: "Failed to save welcome video settings",
        variant: "destructive"
      });
    }
  });

  const handleSave = async () => {
    if (videoSettings) {
      await updateVideoSettings.mutate(videoSettings);
    }
  };

  return (
    <div className="space-y-6">
      <EmailSettings />
      <TemplateManagement />
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Welcome Video Settings</h3>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="video-url">Video Streaming URL</Label>
            <Input
              id="video-url"
              placeholder="Enter video URL"
              value={videoSettings?.url || ''}
              onChange={(e) => {
                if (videoSettings) {
                  updateVideoSettings.mutate({
                    ...videoSettings,
                    url: e.target.value
                  });
                }
              }}
            />
            <p className="text-sm text-muted-foreground">
              Enter the URL of the welcome video that will be shown to candidates
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="embed-code">Video Embed Code</Label>
            <Textarea
              id="embed-code"
              placeholder="Enter video embed code"
              value={videoSettings?.embed_code || ''}
              onChange={(e) => {
                if (videoSettings) {
                  updateVideoSettings.mutate({
                    ...videoSettings,
                    embed_code: e.target.value
                  });
                }
              }}
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Enter the complete embed code provided by Bunny.net for better video responsiveness
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Onboarding Configuration</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-onboarding">
              Enable Onboarding Module
            </Label>
            <Switch id="enable-onboarding" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="require-video">
              Require Demo Video
            </Label>
            <Switch id="require-video" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-approve">
              Auto-Approve Candidates
            </Label>
            <Switch id="auto-approve" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
