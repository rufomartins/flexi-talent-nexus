import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateMediaMutation } from "@/hooks/use-media";

interface MediaCardProps {
  media: {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
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

  return (
    <Card className="p-4 relative">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(media.id)}
        />
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="aspect-video relative mb-4">
        {media.file_type.startsWith("image/") ? (
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/talent-files/${media.file_path}`}
            alt={media.file_name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <video
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/talent-files/${media.file_path}`}
            className="w-full h-full object-cover rounded-md"
            controls
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{media.file_name}</div>
          {isSettingPosition ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded"
              />
              <Button size="sm" onClick={handlePositionSave}>
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingPosition(true)}
            >
              Set position
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {formatDate(media.created_at)} · {formatFileSize(media.file_size)}
        </div>

        <div className="flex items-center justify-between">
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