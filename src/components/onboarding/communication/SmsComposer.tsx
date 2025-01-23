import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SmsComposerProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSend: () => Promise<void>;
  isSending: boolean;
  onCancel: () => void;
}

export function SmsComposer({
  message,
  onMessageChange,
  onSend,
  isSending,
  onCancel,
}: SmsComposerProps) {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Type your SMS message here..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={onSend}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}