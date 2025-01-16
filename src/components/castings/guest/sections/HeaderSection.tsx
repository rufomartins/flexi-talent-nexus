import { FileDown, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeaderSectionProps } from "@/types/guest-content";

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  totalSelected,
  onExport,
  onShare
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Talent Selection</h1>
        <p className="text-gray-600">
          {totalSelected} talents selected
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport}>
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