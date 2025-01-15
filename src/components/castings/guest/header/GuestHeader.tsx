import { Button } from "@/components/ui/button";
import { FileDown, Share } from "lucide-react";

interface GuestHeaderProps {
  castingName: string;
  totalSelected: number;
  onExport: () => void;
  onShare: () => void;
}

export const GuestHeader: React.FC<GuestHeaderProps> = ({
  castingName,
  totalSelected,
  onExport,
  onShare,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{castingName}</h1>
        <p className="text-gray-600">
          Selected: {totalSelected} talents
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onExport} variant="outline">
          <FileDown className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button onClick={onShare}>
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};