import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreVertical, Image, Video, Music, AlertCircle } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateMediaMutation } from "@/hooks/use-media";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";

interface MediaCardProps {
  media: {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    category: 'photo' | 'video' | 'audio';
    created_at: string;
    is_profile: boolean;
    is_shared: boolean;
    position: number;
  };
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const MediaCard = ({ media, onSelect, isSelected }: MediaCardProps) => {
  const updateMedia = useUpdateMediaMutation();
  const [isSettingPosition, setIsSettingPosition] = useState(false);
  const [position, setPosition] = useState(media.position);
  const [mediaError, setMediaError] = useState(false);
  const { toast } = useToast();

  const handlePositionSave = async () => {
    await updateMedia.mutateAsync({
      id: media.id,
      position: position,
    });
    setIsSettingPosition(false);
  };

  const toggleProfile = async () => {
    await updateMedia.mutateAsync({
      id: media.id,
      is_profile: !media.is_profile,
    });
  };

  const toggleShare = async () => {
    await updateMedia.mutateAsync({
      id: media.id,
      is_shared: !media.is_shared,
    });
  };

  const handleMediaError = () => {
    setMediaError(true);
    toast({
      title: "Error loading media",
      description: "Unable to load the media file. Please try again later.",
      variant: "destructive",
    });
  };

  const mediaUrl = new URL(
    `/storage/v1/object/public/talent-files/${media.file_path}`,
    import.meta.env.VITE_SUPABASE_URL
  ).toString();

  const renderMediaPreview = () => {
    if (mediaError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
          <AlertCircle className="h-12 w-12 text-destructive mb-2" />
          <span className="text-sm text-muted-foreground">Failed to load media</span>
        </div>
      );
    }

    switch (media.category) {
      case 'photo':
        return (
          <img
            src={mediaUrl}
            alt={media.file_name}
            className="w-full h-full object-cover"
            onError={handleMediaError}
          />
        );
      case 'video':
        return (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover"
            controls
            onError={handleMediaError}
          />
        );
      case 'audio':
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Music className="h-12 w-12 text-muted-foreground" />
            <audio
              src={mediaUrl}
              className="w-full mt-2"
              controls
              onError={handleMediaError}
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <Card className="relative bg-white overflow-hidden">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(media.id)}
          className="bg-white"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-3 left-3 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingPosition(true)}
          className="bg-white text-sm"
        >
          Set position
        </Button>
      </div>

      <AspectRatio ratio={16 / 9} className="bg-muted">
        {renderMediaPreview()}
      </AspectRatio>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium truncate">{media.file_name}</div>
          {isSettingPosition ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-sm"
              />
              <Button size="sm" onClick={handlePositionSave} className="text-sm">
                Save
              </Button>
            </div>
          ) : null}
        </div>

        <div className="text-sm text-muted-foreground">
          {formatDate(media.created_at)} · {formatFileSize(media.file_size)}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={media.is_profile}
                onCheckedChange={toggleProfile}
              />
              <span className="text-sm">Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={media.is_shared}
                onCheckedChange={toggleShare}
              />
              <span className="text-sm">Share</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};