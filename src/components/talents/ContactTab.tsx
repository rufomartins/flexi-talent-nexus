
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Phone, MapPin } from "lucide-react";
import { TalentProfileData } from "@/types/talent-profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";

interface ContactTabProps {
  talent: TalentProfileData;
  onTalentUpdate?: () => void;
}

export const ContactTab = ({ talent, onTalentUpdate }: ContactTabProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get initial data from talent profile
  const [formData, setFormData] = useState({
    phone: talent.user.mobile_phone || "",
    whatsappNumber: talent.talent_profile.whatsapp_number || "",
    country: talent.talent_profile.country || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Update user data
      const { error: userError } = await supabase
        .from("users")
        .update({
          mobile_phone: formData.phone,
        })
        .eq("id", talent.user.id);

      if (userError) throw userError;

      // Update talent profile
      const { error: profileError } = await supabase
        .from("talent_profiles")
        .update({
          whatsapp_number: formData.whatsappNumber,
          country: formData.country,
        })
        .eq("user_id", talent.user.id);

      if (profileError) throw profileError;

      toast({
        title: "Contact info updated",
        description: "Contact information has been successfully updated.",
      });

      setIsEditing(false);
      if (onTalentUpdate) onTalentUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact information",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          {isEditing ? (
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 123 456 7890"
            />
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">
              {formData.phone || "No phone number provided"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          {isEditing ? (
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              placeholder="+1 123 456 7890"
            />
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">
              {formData.whatsappNumber || "No WhatsApp number provided"}
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="country" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Country
          </Label>
          {isEditing ? (
            <Select
              value={formData.country}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
            >
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">
              {formData.country || "No country specified"}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
