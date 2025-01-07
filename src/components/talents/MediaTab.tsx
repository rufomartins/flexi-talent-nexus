import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { TalentProfileData } from "@/types/talent-profile";
import { STORAGE_CONFIG } from "@/lib/storage-config";
import { useToast } from "@/components/ui/use-toast";
import { MediaToolbar } from "./media/MediaToolbar";
import { MediaGrid } from "./media/MediaGrid";

interface MediaTabProps {
  talent: TalentProfileData;
}

export const MediaTab = ({ talent }: MediaTabProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState<"all" | "photo" | "video" | "audio">("all");
  const { toast } = useToast();

  const { data: media, isLoading } = useQuery({
    queryKey: ["talent-media", talent.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_media")
        .select("*")
        .eq("talent_id", talent.user.id)
        .order("position", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const NO_MEDIA_ROLES = ['translator', 'reviewer'] as const;
  const canUploadMedia = !NO_MEDIA_ROLES.includes(talent.user.role as typeof NO_MEDIA_ROLES[number]);

  const handleDownloadSelection = async () => {
    if (!selectedItems.length) return;

    try {
      for (const id of selectedItems) {
        const mediaItem = media?.find(m => m.id === id);
        if (mediaItem) {
          const { data, error } = await supabase.storage
            .from(STORAGE_CONFIG.BUCKET_NAME)
            .download(mediaItem.file_path);

          if (error) throw error;

          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = mediaItem.file_name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
      toast({
        title: "Success",
        description: "Files downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download files",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelection = async () => {
    if (!selectedItems.length) return;

    try {
      const filesToDelete = media
        ?.filter(m => selectedItems.includes(m.id))
        .map(m => m.file_path) || [];

      if (filesToDelete.length) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_CONFIG.BUCKET_NAME)
          .remove(filesToDelete);

        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from("talent_media")
        .delete()
        .in("id", selectedItems);

      if (dbError) throw dbError;

      setSelectedItems([]);
      toast({
        title: "Success",
        description: "Files deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete files",
        variant: "destructive",
      });
    }
  };

  const filteredMedia = media?.filter(item => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = mediaType === "all" || item.category === mediaType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <MediaToolbar
        selectedItems={selectedItems}
        onDownloadSelection={handleDownloadSelection}
        onDeleteSelection={handleDeleteSelection}
        onUploadClick={() => setIsUploadOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mediaType={mediaType}
        onMediaTypeChange={(value: string) => setMediaType(value as "all" | "photo" | "video" | "audio")}
        canUploadMedia={canUploadMedia}
      />

      <div className="text-sm text-muted-foreground italic">
        These files are also viewable by the talent via the update form
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MediaGrid
          media={filteredMedia || []}
          selectedItems={selectedItems}
          onSelect={(id) => {
            setSelectedItems((prev) => 
              prev.includes(id) 
                ? prev.filter((i) => i !== id)
                : [...prev, id]
            );
          }}
        />
      )}

      <MediaUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        talentId={talent.user.id}
        talentRole={talent.user.role}
      />
    </div>
  );
};