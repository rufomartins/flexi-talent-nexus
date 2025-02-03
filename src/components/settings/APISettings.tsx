import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function APISettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSaveKeys = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const keys = {
        resend: formData.get('resend'),
        cloudmailin: formData.get('cloudmailin'),
        agora: formData.get('agora'),
        twilio: formData.get('twilio')
      };

      const updates = Object.entries(keys).map(([name, value]) => ({
        name,
        value: { key: value },
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('api_settings')
        .upsert(
          updates.map(update => ({
            name: update.name,
            value: update.value as any,
            updated_at: update.updated_at
          }))
        );

      if (error) throw error;

      toast({
        title: "Success",
        description: "API keys have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">API Settings</h3>
      <form onSubmit={handleSaveKeys} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resend">Resend API Key</Label>
          <Input
            id="resend"
            name="resend"
            type="password"
            placeholder="Enter Resend API key"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cloudmailin">CloudMailin API Key</Label>
          <Input
            id="cloudmailin"
            name="cloudmailin"
            type="password"
            placeholder="Enter CloudMailin API key"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agora">Agora API Key</Label>
          <Input
            id="agora"
            name="agora"
            type="password"
            placeholder="Enter Agora API key"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twilio">Twilio API Key</Label>
          <Input
            id="twilio"
            name="twilio"
            type="password"
            placeholder="Enter Twilio API key"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save API Keys"}
        </Button>
      </form>
    </Card>
  );
}