import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
  talentRole: UserRole;
}

export const MediaUploadDialog = ({
  open,
  onOpenChange,
  talentId,
  talentRole,
}: MediaUploadDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const getAllowedTypes = (role: UserRole) => {
    switch (role) {
      case "voice_over_artist":
        return "audio/mpeg,audio/wav";
      case "ugc_talent":
        return "video/*,image/*";
      default:
        return "image/*";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${talentId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('talent-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('talent_media')
          .insert({
            talent_id: talentId,
            file_path: filePath,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
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
          <div className="space-y-2">
            <Label htmlFor="files">Select files</Label>
            <Input
              id="files"
              type="file"
              accept={getAllowedTypes(talentRole)}
              multiple
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFiles || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};