import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Trash2, Filter, Search } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { TalentProfileData } from "@/types/talent-profile";
import { STORAGE_CONFIG } from "@/lib/storage-config";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

          // Create download link
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
      // Delete files from storage
      const filesToDelete = media
        ?.filter(m => selectedItems.includes(m.id))
        .map(m => m.file_path) || [];

      if (filesToDelete.length) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_CONFIG.BUCKET_NAME)
          .remove(filesToDelete);

        if (storageError) throw storageError;
      }

      // Delete records from database
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
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => setIsUploadOpen(true)} 
          disabled={!canUploadMedia}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add media
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadSelection}
          disabled={selectedItems.length === 0}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none"
        >
          <Download className="mr-2 h-4 w-4" />
          Download selection
        </Button>
        <Button
          variant="outline"
          onClick={handleDeleteSelection}
          disabled={selectedItems.length === 0}
          className="bg-red-50 text-red-600 hover:bg-red-100 border-none"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete selection
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <Select value={mediaType} onValueChange={(value: any) => setMediaType(value)}>
            <SelectTrigger className="bg-white border w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="photo">Photos</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground italic">
        These files are also viewable by the talent via the update form
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia?.map((item) => (
            <MediaCard
              key={item.id}
              media={item}
              onSelect={(id) => {
                setSelectedItems((prev) => 
                  prev.includes(id) 
                    ? prev.filter((i) => i !== id)
                    : [...prev, id]
                );
              }}
              isSelected={selectedItems.includes(item.id)}
            />
          ))}
        </div>
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