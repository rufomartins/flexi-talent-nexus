import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Trash2, Search, MoveUp, Tag, Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaToolbarProps {
  selectedItems: string[];
  onDownloadSelection: () => void;
  onDeleteSelection: () => void;
  onMoveSelection: () => void;
  onTagSelection: () => void;
  onBulkEdit: () => void;
  onUploadClick: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  mediaType: string;
  onMediaTypeChange: (value: string) => void;
  canUploadMedia: boolean;
}

export const MediaToolbar = ({
  selectedItems,
  onDownloadSelection,
  onDeleteSelection,
  onMoveSelection,
  onTagSelection,
  onBulkEdit,
  onUploadClick,
  searchQuery,
  onSearchChange,
  mediaType,
  onMediaTypeChange,
  canUploadMedia,
}: MediaToolbarProps) => {
  const hasSelection = selectedItems.length > 0;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button 
        onClick={onUploadClick} 
        disabled={!canUploadMedia}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add media
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onDownloadSelection}
          disabled={!hasSelection}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none"
        >
          <Download className="mr-2 h-4 w-4" />
          Download ({selectedItems.length})
        </Button>

        <Button
          variant="outline"
          onClick={onMoveSelection}
          disabled={!hasSelection}
          className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-none"
        >
          <MoveUp className="mr-2 h-4 w-4" />
          Move
        </Button>

        <Button
          variant="outline"
          onClick={onTagSelection}
          disabled={!hasSelection}
          className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-none"
        >
          <Tag className="mr-2 h-4 w-4" />
          Tag
        </Button>

        <Button
          variant="outline"
          onClick={onBulkEdit}
          disabled={!hasSelection}
          className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-none"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="outline"
          onClick={onDeleteSelection}
          disabled={!hasSelection}
          className="bg-red-50 text-red-600 hover:bg-red-100 border-none"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete ({selectedItems.length})
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Select value={mediaType} onValueChange={onMediaTypeChange}>
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-[200px]"
          />
        </div>
      </div>
    </div>
  );
};