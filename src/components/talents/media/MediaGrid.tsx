import { MediaCard } from "../MediaCard";

interface MediaGridProps {
  media: Array<{
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
  }>;
  selectedItems: string[];
  onSelect: (id: string) => void;
}

export const MediaGrid = ({ media, selectedItems, onSelect }: MediaGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onSelect={(id) => onSelect(id)}
          isSelected={selectedItems.includes(item.id)}
        />
      ))}
    </div>
  );
};