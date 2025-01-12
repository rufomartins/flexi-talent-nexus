import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selection: GuestSelection;
  onSave: (comment: string) => Promise<void>;
}

const MAX_CHARS = 500;

export function CommentDialog({ isOpen, onClose, selection, onSave }: CommentDialogProps) {
  const [comment, setComment] = useState(selection.comments || "");
  const [isSaving, setIsSaving] = useState(false);
  const charsLeft = MAX_CHARS - comment.length;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(comment);
      onClose();
    } catch (error) {
      console.error("Failed to save comment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comments here..."
            className="min-h-[100px]"
            maxLength={MAX_CHARS}
          />
          <div className="text-sm text-muted-foreground text-right">
            {charsLeft} characters remaining
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}