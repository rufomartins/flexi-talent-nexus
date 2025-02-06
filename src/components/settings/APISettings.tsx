import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function APISettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const settings = Array.from(formData.entries()).map(([name, value]) => ({
      name,
      value: { key: value },
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('api_settings')
      .upsert(
        settings.map(setting => ({
          name: setting.name,
          value: setting.value as any,
          updated_at: setting.updated_at
        }))
      );

    if (error) {
      console.error('Error updating API settings:', error);
      return;
    }

    toast({
      title: "Success",
      description: "API settings updated successfully",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">API Settings</h1>
      <form onSubmit={handleSubmit}>
        {settings.map((setting) => (
          <div key={setting.name} className="mb-4">
            <label className="block text-sm font-medium">{setting.name}</label>
            <Input
              defaultValue={setting.value.key}
              name={setting.name}
              required
            />
          </div>
        ))}
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}