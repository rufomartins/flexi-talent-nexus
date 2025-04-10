
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { TalentProfileData } from "@/types/talent-profile";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SummaryTabProps {
  talent: TalentProfileData;
}

export const SummaryTab = ({ talent }: SummaryTabProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: talent.user.first_name || "",
    lastName: talent.user.last_name || "",
    email: talent.user.email || "",
    gender: talent.user.gender || "",
    category: talent.talent_profile.category || "UGC",
    status: talent.talent_profile.evaluation_status || "under_evaluation",
    internalRemarks: talent.talent_profile.internal_remarks || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Update user data
      const { error: userError } = await supabase
        .from("users")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
        })
        .eq("id", talent.user.id);

      if (userError) throw userError;

      // Update talent profile
      const { error: profileError } = await supabase
        .from("talent_profiles")
        .update({
          category: formData.category,
          evaluation_status: formData.status,
          internal_remarks: formData.internalRemarks,
        })
        .eq("user_id", talent.user.id);

      if (profileError) throw profileError;

      toast({
        title: "Profile updated",
        description: "Talent profile has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update talent profile",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "under_evaluation":
        return "warning";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          {isEditing ? (
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">{formData.firstName}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          {isEditing ? (
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">{formData.lastName}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="p-2 border rounded-md bg-muted/30">{formData.email}</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          {isEditing ? (
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">
              {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "Not specified"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Talent Category</Label>
          {isEditing ? (
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UGC">UGC</SelectItem>
                <SelectItem value="TRANSLATOR">Translator</SelectItem>
                <SelectItem value="REVIEWER">Reviewer</SelectItem>
                <SelectItem value="VOICE_OVER">Voice Over</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">{formData.category}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          {isEditing ? (
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="under_evaluation">Under Evaluation</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 border rounded-md bg-muted/30">
              <Badge variant={getStatusBadgeVariant(formData.status) as any}>
                {formData.status === "under_evaluation" 
                  ? "Under Evaluation" 
                  : formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="internalRemarks">Internal Remarks</Label>
        {isEditing ? (
          <Textarea
            id="internalRemarks"
            name="internalRemarks"
            value={formData.internalRemarks || ""}
            onChange={handleInputChange}
            rows={4}
          />
        ) : (
          <div className="p-2 border rounded-md bg-muted/30 min-h-[100px]">
            {formData.internalRemarks || "No internal remarks"}
          </div>
        )}
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
