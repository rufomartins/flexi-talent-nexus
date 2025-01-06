import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Enums } from "@/integrations/supabase/types";

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
  talentRole: Enums["user_role"];
}

export const MediaUploadDialog = ({
  open,
  onOpenChange,
  talentId,
  talentRole,
}: MediaUploadDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const getAllowedTypes = (role: Enums["user_role"]) => {
    switch (role) {
      case "voice_over_artist":
        return "audio/mpeg,audio/wav";
      case "ugc_talent":
        return "image/*,video/*";
      default:
        return "";
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${talentId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("talent-files")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from("talent_media")
          .insert({
            talent_id: talentId,
            file_path: filePath,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            position: 0,
            is_profile: false,
            is_shared: true,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "Media files uploaded successfully",
      });
      onOpenChange(false);
      setFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload media files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            multiple
            accept={getAllowedTypes(talentRole)}
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};