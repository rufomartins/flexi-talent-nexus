import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { Shot } from "@/types/shot-list";

interface ShotSelectionGroupProps {
  shots: Shot[];
  selectedShots: string[];
  onSelectionChange: (shotIds: string[]) => void;
}

export function ShotSelectionGroup({ shots, selectedShots, onSelectionChange }: ShotSelectionGroupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredShots = shots.filter(shot => {
    const matchesSearch = shot.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shot.shot_number.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || shot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    const newSelection = filteredShots.map(shot => shot.id);
    onSelectionChange(newSelection);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleShotToggle = (shotId: string) => {
    const newSelection = selectedShots.includes(shotId)
      ? selectedShots.filter(id => id !== shotId)
      : [...selectedShots, shotId];
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search shots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <select
          className="h-10 rounded-md border border-input px-3"
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter(e.target.value || null)}
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedShots.length} shot{selectedShots.length !== 1 ? 's' : ''} selected
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredShots.map((shot) => (
          <div
            key={shot.id}
            className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              id={`shot-${shot.id}`}
              checked={selectedShots.includes(shot.id)}
              onCheckedChange={() => handleShotToggle(shot.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor={`shot-${shot.id}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Shot {shot.shot_number}
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                {shot.description || 'No description'}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-muted">
                  {shot.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}