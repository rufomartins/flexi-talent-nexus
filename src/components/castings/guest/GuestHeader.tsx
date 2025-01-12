import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import type { Casting } from "@/types/casting";

interface GuestHeaderProps {
  casting: Casting;
  onExport: () => void;
  onShare: () => void;
}

export const GuestHeader: React.FC<GuestHeaderProps> = ({
  casting,
  onExport,
  onShare,
}) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">{casting.name}</h1>
        {casting.client && (
          <p className="text-muted-foreground">Client: {casting.client.full_name}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};