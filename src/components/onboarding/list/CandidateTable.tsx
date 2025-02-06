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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={candidates.length > 0 && selectedCandidates.length === candidates.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const isSelected = selectedCandidates.includes(candidate.id);
            const isEditing = editingId === candidate.id;
            
            return (
              <TableRow key={candidate.id}>
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
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
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