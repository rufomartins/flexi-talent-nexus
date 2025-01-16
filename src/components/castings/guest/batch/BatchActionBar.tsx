import { Star, StarOff, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BatchActionBarProps {
  selectedCount: number;
  onFavorite: () => void;
  onUnfavorite: () => void;
  onRemove: () => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  onFavorite,
  onUnfavorite,
  onRemove
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">{selectedCount} talents selected</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onFavorite}>
          <Star className="w-4 h-4 mr-2" />
          Favorite
        </Button>
        <Button variant="outline" onClick={onUnfavorite}>
          <StarOff className="w-4 h-4 mr-2" />
          Unfavorite
        </Button>
        <Button variant="destructive" onClick={onRemove}>
          <Trash className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
};