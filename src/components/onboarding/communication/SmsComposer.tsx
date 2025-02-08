
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SmsComposerProps } from "@/types/onboarding";

export function SmsComposer({ templates, data, onChange, onInsertTag }: SmsComposerProps) {
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onChange({
        templateId,
        message: template.message
      });
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium">SMS Template</label>
        <Select value={data.templateId} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-full bg-white border border-gray-300 z-50">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
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
