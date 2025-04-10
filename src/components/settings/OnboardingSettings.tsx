
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { APIConfigs, VideoSettings } from "@/types/api-settings";
import { Json } from "@/integrations/supabase/types";

interface OnboardingSettingsProps {
  getSettingValue: <T extends keyof APIConfigs>(name: T) => APIConfigs[T];
  updateSettings: (data: { name: string; value: any }) => void;
}

export function OnboardingSettings({ getSettingValue, updateSettings }: OnboardingSettingsProps) {
  const videoSettings = getSettingValue('video_settings') as VideoSettings;
  const [videoUrl, setVideoUrl] = useState<string>(videoSettings?.url || "");
  const [embedCode, setEmbedCode] = useState<string>(videoSettings?.embed_code || "");
  const { toast } = useToast();

  const handleSave = () => {
    updateSettings({
      name: 'video_settings',
      value: {
        ...videoSettings,
        url: videoUrl,
        embed_code: embedCode
      } as unknown as Json
    });

    toast({
      title: "Success",
      description: "Video settings updated successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding Video Settings</CardTitle>
        <CardDescription>Configure the onboarding video URL and embed code.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            placeholder="Enter video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="embed-code">Embed Code</Label>
          <Input
            id="embed-code"
            placeholder="Enter embed code"
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
