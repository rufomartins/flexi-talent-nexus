import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SmsComposerProps {
  data: {
    templateId: string;
    message: string;
  };
  onChange: (data: { templateId: string; message: string }) => void;
  onInsertTag: (tag: string) => void;
}

export function SmsComposer({ data, onChange, onInsertTag }: SmsComposerProps) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium">SMS Template</label>
        <Select
          value={data.templateId}
          onValueChange={(value) => onChange({ ...data, templateId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="template1">Template 1</SelectItem>
            <SelectItem value="template2">Template 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Message</label>
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertTag('First Name')}
          >
            Add First Name
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertTag('Last Name')}
          >
            Add Last Name
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInsertTag('Full Name')}
          >
            Add Full Name
          </Button>
        </div>
        <Textarea
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          placeholder="Type your SMS message here..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}