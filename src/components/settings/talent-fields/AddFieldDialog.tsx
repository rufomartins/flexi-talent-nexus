import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FieldType } from "@/types/talent-fields";

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddFieldDialog = ({ open, onOpenChange }: AddFieldDialogProps) => {
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [tab, setTab] = useState("summary");
  const [isRequired, setIsRequired] = useState(false);
  const [showOnSignup, setShowOnSignup] = useState(false);
  const [guestAccess, setGuestAccess] = useState(false);

  const queryClient = useQueryClient();

  const addField = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("talent_profile_fields")
        .insert({
          label,
          field_type: fieldType,
          tab,
          is_required: isRequired,
          show_on_signup: showOnSignup,
          guest_access: guestAccess,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-profile-fields"] });
      toast.success("Field added successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add field");
      console.error("Error adding field:", error);
    },
  });

  const resetForm = () => {
    setLabel("");
    setFieldType("text");
    setTab("summary");
    setIsRequired(false);
    setShowOnSignup(false);
    setGuestAccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Field</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Field Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter field label"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Field Type</Label>
            <Select value={fieldType} onValueChange={(value) => setFieldType(value as FieldType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="long_text">Long Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="single_select">Single Select</SelectItem>
                <SelectItem value="multi_select">Multi Select</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tab">Tab</Label>
            <Select value={tab} onValueChange={setTab}>
              <SelectTrigger>
                <SelectValue placeholder="Select tab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required Field</Label>
            <Switch
              id="required"
              checked={isRequired}
              onCheckedChange={setIsRequired}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="signup">Show on Signup</Label>
            <Switch
              id="signup"
              checked={showOnSignup}
              onCheckedChange={setShowOnSignup}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="guest">Guest Access</Label>
            <Switch
              id="guest"
              checked={guestAccess}
              onCheckedChange={setGuestAccess}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => addField.mutate()}>
            Add Field
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};