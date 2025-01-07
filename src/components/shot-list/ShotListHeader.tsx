import { ArrowLeft, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShotListHeader() {
  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Product Launch Video</h1>
          <p className="text-sm text-muted-foreground">Task ID: #123</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}