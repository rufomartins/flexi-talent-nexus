import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function TalentSettings() {
  const { toast } = useToast();
  const [autoApprove, setAutoApprove] = useState(false);
  const [requirePortfolio, setRequirePortfolio] = useState(true);
  const [maxDuoPartners, setMaxDuoPartners] = useState("2");
  const [enableNotifications, setEnableNotifications] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Talent settings have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Talent Onboarding</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-approve">
              Auto-approve new talents
            </Label>
            <Switch
              id="auto-approve"
              checked={autoApprove}
              onCheckedChange={setAutoApprove}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="require-portfolio">
              Require portfolio submission
            </Label>
            <Switch
              id="require-portfolio"
              checked={requirePortfolio}
              onCheckedChange={setRequirePortfolio}
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="max-duo-partners">Maximum Duo Partners</Label>
            <Input
              id="max-duo-partners"
              type="number"
              value={maxDuoPartners}
              onChange={(e) => setMaxDuoPartners(e.target.value)}
              min="1"
              max="5"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-notifications">
              Enable talent notifications
            </Label>
            <Switch
              id="enable-notifications"
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}