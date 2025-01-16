import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Share } from "lucide-react";
import { toast } from "sonner";

interface ShareConfig {
  expiresIn: number;  // Hours
  allowComments: boolean;
  readonly: boolean;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (config: ShareConfig) => Promise<void>;
  isSharing?: boolean;
}

export function ShareDialog({ 
  open, 
  onOpenChange, 
  onShare,
  isSharing = false 
}: ShareDialogProps) {
  const [config, setConfig] = useState<ShareConfig>({
    expiresIn: 24,
    allowComments: true,
    readonly: false
  });

  const handleSubmit = async () => {
    try {
      await onShare(config);
      toast.success("Share link created successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create share link");
      console.error("Share error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Selections</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="expires">Link expires in</Label>
            <Select
              value={config.expiresIn.toString()}
              onValueChange={(value) => 
                setConfig(prev => ({ ...prev, expiresIn: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiration time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">2 days</SelectItem>
                <SelectItem value="72">3 days</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="comments"
              checked={config.allowComments}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, allowComments: checked as boolean }))
              }
            />
            <Label htmlFor="comments">Allow comments from viewers</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="readonly"
              checked={config.readonly}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, readonly: checked as boolean }))
              }
            />
            <Label htmlFor="readonly">Read-only access</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSharing}>
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating link...
              </>
            ) : (
              <>
                <Share className="mr-2 h-4 w-4" />
                Create share link
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}