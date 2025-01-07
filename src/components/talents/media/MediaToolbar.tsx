import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Trash2, Search } from "lucide-react";
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
  onUploadClick,
  searchQuery,
  onSearchChange,
  mediaType,
  onMediaTypeChange,
  canUploadMedia,
}: MediaToolbarProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={onUploadClick} 
        disabled={!canUploadMedia}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add media
      </Button>
      <Button
        variant="outline"
        onClick={onDownloadSelection}
        disabled={selectedItems.length === 0}
        className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none"
      >
        <Download className="mr-2 h-4 w-4" />
        Download selection
      </Button>
      <Button
        variant="outline"
        onClick={onDeleteSelection}
        disabled={selectedItems.length === 0}
        className="bg-red-50 text-red-600 hover:bg-red-100 border-none"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete selection
      </Button>
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