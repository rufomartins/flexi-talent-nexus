
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/utils/languages";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import type { Candidate } from "@/types/onboarding";

export interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: string[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectAll: (checked: boolean) => void;
  stage: 'ingest' | 'process' | 'screening' | 'results';
  getStatusColor: (status: string) => string;
}

export function CandidateTable({ 
  candidates, 
  selectedCandidates, 
  onSelectCandidate, 
  onSelectAll,
  stage,
  getStatusColor 
}: CandidateTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleFieldChange = async (candidateId: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from('onboarding_candidates')
        .update({ [field]: value })
        .eq('id', candidateId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={candidates.length > 0 && selectedCandidates.length === candidates.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="min-w-[120px]">Full Name</TableHead>
            <TableHead className="min-w-[120px]">First Name</TableHead>
            <TableHead className="min-w-[120px]">Last Name</TableHead>
            <TableHead className="min-w-[200px]">Email</TableHead>
            <TableHead className="min-w-[120px]">Phone</TableHead>
            <TableHead className="min-w-[180px]">Language</TableHead>
            <TableHead className="min-w-[120px]">Source</TableHead>
            <TableHead className="min-w-[120px]">Status</TableHead>
            <TableHead className="text-right min-w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const isSelected = selectedCandidates.includes(candidate.id);
            const isEditing = editingId === candidate.id;
            
            return (
              <TableRow key={candidate.id} className={isSelected ? "bg-muted/50" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelectCandidate(candidate)}
                  />
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input 
                      value={candidate.name || ''}
                      onChange={(e) => handleFieldChange(candidate.id, 'name', e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    candidate.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input 
                      value={candidate.first_name || ''}
                      onChange={(e) => handleFieldChange(candidate.id, 'first_name', e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    candidate.first_name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input 
                      value={candidate.last_name || ''}
                      onChange={(e) => handleFieldChange(candidate.id, 'last_name', e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    candidate.last_name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input 
                      value={candidate.email || ''}
                      onChange={(e) => handleFieldChange(candidate.id, 'email', e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    candidate.email
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input 
                      value={candidate.phone || ''}
                      onChange={(e) => handleFieldChange(candidate.id, 'phone', e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    candidate.phone
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={candidate.language || ""}
                      onValueChange={(value) => handleFieldChange(candidate.id, 'language', value)}
                    >
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 max-h-[300px]">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <SelectItem 
                            key={lang} 
                            value={lang}
                            className="hover:bg-muted/50 cursor-pointer"
                          >
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    candidate.language
                  )}
                </TableCell>
                <TableCell>{candidate.source}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      candidate.status
                    )}`}
                  >
                    {candidate.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {isSelected && (
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingId(isEditing ? null : candidate.id)}
                      >
                        {isEditing ? 'Done' : 'Edit'}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
