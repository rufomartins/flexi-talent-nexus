import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCastingForm } from '../../hooks/useCastingForm';
import type { CastingFormField } from '../../types';

interface CastingFormBuilderProps {
  castingId: string;
  onSave: (fields: CastingFormField[]) => void;
}

export const CastingFormBuilder: React.FC<CastingFormBuilderProps> = ({ castingId, onSave }) => {
  const { customFields, addField, updateField } = useCastingForm(castingId);

  const handleAddField = () => {
    addField({
      label: '',
      type: 'text',
      required: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Form Builder</h2>
        <Button onClick={handleAddField}>Add Field</Button>
      </div>

      <div className="space-y-4">
        {customFields.map((field) => (
          <Card key={field.id} className="p-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Required</span>
                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                  />
                </div>
              </div>

              <Select
                value={field.type}
                onValueChange={(value) => updateField(field.id, { 
                  type: value as CastingFormField['type']
                })}
              >
                <SelectTrigger className="max-w-sm">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="multiselect">Multi Select</SelectItem>
                </SelectContent>
              </Select>

              {(field.type === 'select' || field.type === 'multiselect') && (
                <Input
                  placeholder="Options (comma separated)"
                  value={field.options?.join(', ') || ''}
                  onChange={(e) => updateField(field.id, { 
                    options: e.target.value.split(',').map(opt => opt.trim()) 
                  })}
                  className="max-w-sm"
                />
              )}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={() => onSave(customFields)} className="w-full">
        Save Form
      </Button>
    </div>
  );
}