import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface EmailComposerProps {
  templates: EmailTemplate[];
  data: {
    templateId: string;
    subject: string;
    body: string;
  };
  onChange: (data: { templateId: string; subject: string; body: string }) => void;
  onInsertTag: (tag: string) => void;
}

export function EmailComposer({ templates, data, onChange, onInsertTag }: EmailComposerProps) {
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onChange({
        templateId,
        subject: template.subject,
        body: template.body
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Email Template</label>
        <Select value={data.templateId} onValueChange={handleTemplateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Subject</label>
        <Input
          value={data.subject}
          onChange={(e) => onChange({ ...data, subject: e.target.value })}
          placeholder="Email subject"
        />
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
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          placeholder="Type your message here..."
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
}