import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { TalentProfileData } from "@/types/talent-profile";
import { STORAGE_CONFIG } from "@/lib/storage-config";
import { useToast } from "@/components/ui/use-toast";
import { MediaToolbar } from "./media/MediaToolbar";
import { MediaGrid } from "./media/MediaGrid";
import { MediaCategory, MediaItem } from "@/types/media";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MediaTabProps {
  talent: TalentProfileData;
}

export const MediaTab = ({ talent }: MediaTabProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState<"all" | MediaCategory>("all");
  const [newFolder, setNewFolder] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newDescription, setNewDescription] = useState("");
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
      
      return (data || []).map(item => ({
        ...item,
        category: item.category as MediaCategory
      })) as MediaItem[];
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

  const handleMoveSelection = async () => {
    if (!selectedItems.length || !newFolder) return;

    try {
      const { error } = await supabase
        .from("talent_media")
        .update({ folder: newFolder })
        .in("id", selectedItems);

      if (error) throw error;

      setSelectedItems([]);
      setIsMoveDialogOpen(false);
      setNewFolder("");
      toast({
        title: "Success",
        description: "Files moved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move files",
        variant: "destructive",
      });
    }
  };

  const handleTagSelection = async () => {
    if (!selectedItems.length || !newTags) return;

    try {
      const tags = newTags.split(",").map(tag => tag.trim());
      const { error } = await supabase
        .from("talent_media")
        .update({ tags })
        .in("id", selectedItems);

      if (error) throw error;

      setSelectedItems([]);
      setIsTagDialogOpen(false);
      setNewTags("");
      toast({
        title: "Success",
        description: "Tags updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tags",
        variant: "destructive",
      });
    }
  };

  const handleBulkEdit = async () => {
    if (!selectedItems.length || !newDescription) return;

    try {
      const { error } = await supabase
        .from("talent_media")
        .update({ description: newDescription })
        .in("id", selectedItems);

      if (error) throw error;

      setSelectedItems([]);
      setIsEditDialogOpen(false);
      setNewDescription("");
      toast({
        title: "Success",
        description: "Description updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update description",
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
        onMoveSelection={() => setIsMoveDialogOpen(true)}
        onTagSelection={() => setIsTagDialogOpen(true)}
        onBulkEdit={() => setIsEditDialogOpen(true)}
        onUploadClick={() => setIsUploadOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mediaType={mediaType}
        onMediaTypeChange={(value: string) => setMediaType(value as "all" | MediaCategory)}
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

      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder">New Folder</Label>
              <Input
                id="folder"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMoveSelection}>Move Files</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTagSelection}>Update Tags</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Description</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEdit}>Update Description</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};