import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { ExportConfig } from "@/types/supabase/export";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  castingId: string;
  guestId: string;
  onExport: (config: ExportConfig) => Promise<void>;
}

export function ExportDialog({ open, onOpenChange, onExport }: ExportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [include, setInclude] = useState({
    talents: true,
    comments: true,
    preferences: true,
    media: false,
  });
  const [filterBy, setFilterBy] = useState({
    favorited: false,
    hasComments: false,
    preferenceRange: {
      min: 1,
      max: 10,
    },
  });

  const handleExport = async () => {
    try {
      setIsLoading(true);
      await onExport({
        format,
        include,
        filterBy,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Selections</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as 'pdf' | 'excel')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf">PDF Document</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel">Excel Spreadsheet</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Include Content</Label>
            <div className="grid gap-2">
              {Object.entries(include).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setInclude((prev) => ({ ...prev, [key]: checked }))
                    }
                  />
                  <Label htmlFor={key} className="capitalize">
                    {key.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Filters</Label>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorited"
                  checked={filterBy.favorited}
                  onCheckedChange={(checked) =>
                    setFilterBy((prev) => ({ ...prev, favorited: !!checked }))
                  }
                />
                <Label htmlFor="favorited">Only Favorited Talents</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasComments"
                  checked={filterBy.hasComments}
                  onCheckedChange={(checked) =>
                    setFilterBy((prev) => ({ ...prev, hasComments: !!checked }))
                  }
                />
                <Label htmlFor="hasComments">Only With Comments</Label>
              </div>
              <div className="space-y-2">
                <Label>Preference Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={filterBy.preferenceRange.max}
                    value={filterBy.preferenceRange.min}
                    onChange={(e) =>
                      setFilterBy((prev) => ({
                        ...prev,
                        preferenceRange: {
                          ...prev.preferenceRange,
                          min: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    min={filterBy.preferenceRange.min}
                    value={filterBy.preferenceRange.max}
                    onChange={(e) =>
                      setFilterBy((prev) => ({
                        ...prev,
                        preferenceRange: {
                          ...prev.preferenceRange,
                          max: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}