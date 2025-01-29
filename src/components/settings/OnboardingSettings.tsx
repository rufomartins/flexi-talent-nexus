import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function OnboardingSettings() {
  const { toast } = useToast();

  const handleSave = async () => {
    toast({
      title: "Settings saved",
      description: "Onboarding settings have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
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

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">
              Email Notifications
            </Label>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">
              SMS Notifications
            </Label>
            <Switch id="sms-notifications" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Interview Settings</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-duration">Minimum Duration (minutes)</Label>
              <Input id="min-duration" type="number" defaultValue={30} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-duration">Maximum Duration (minutes)</Label>
              <Input id="max-duration" type="number" defaultValue={60} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-schedule">
              Enable Auto-Scheduling
            </Label>
            <Switch id="auto-schedule" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}