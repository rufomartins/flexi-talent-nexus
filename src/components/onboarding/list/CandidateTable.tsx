import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CandidateActions } from "./CandidateActions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/utils/languages";
import type { CandidateTableProps } from "@/types/onboarding";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formatName = (candidate: any) => {
  if (candidate.name) return candidate.name;
  if (candidate.first_name || candidate.last_name) {
    return [candidate.first_name, candidate.last_name].filter(Boolean).join(' ');
  }
  return '';
};

export function CandidateTable({ 
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  stage,
  getStatusColor
}: CandidateTableProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});

  const startEditing = (candidate: any) => {
    setEditingId(candidate.id);
    setEditValues({
      name: candidate.name || '',
      first_name: candidate.first_name || '',
      last_name: candidate.last_name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      language: candidate.language || '',
      source: candidate.source || '',
      remarks: candidate.remarks || ''
    });
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('onboarding_candidates')
        .update({
          name: editValues.name || null,
          first_name: editValues.first_name || null,
          last_name: editValues.last_name || null,
          email: editValues.email || null,
          phone: editValues.phone || null,
          language: editValues.language || null,
          source: editValues.source || null,
          remarks: editValues.remarks || null
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Candidate information updated successfully",
      });
      
      setEditingId(null);
      setEditValues({});
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast({
        title: "Error",
        description: "Failed to update candidate information",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
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
            <TableHead>Remarks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const isEditing = editingId === candidate.id;
            
            return (
              <TableRow key={candidate.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCandidates.some(c => c.id === candidate.id)}
                    onCheckedChange={() => onSelectCandidate(candidate)}
                  />
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editValues.name}
                      onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                    />
                  ) : (
                    formatName(candidate)
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editValues.first_name}
                      onChange={(e) => setEditValues({...editValues, first_name: e.target.value})}
                    />
                  ) : (
                    candidate.first_name || ''
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editValues.last_name}
                      onChange={(e) => setEditValues({...editValues, last_name: e.target.value})}
                    />
                  ) : (
                    candidate.last_name || ''
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editValues.email}
                      onChange={(e) => setEditValues({...editValues, email: e.target.value})}
                    />
                  ) : (
                    candidate.email || ''
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editValues.phone}
                      onChange={(e) => setEditValues({...editValues, phone: e.target.value})}
                    />
                  ) : (
                    candidate.phone || ''
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      value={editValues.language}
                      onValueChange={(value) => setEditValues({...editValues, language: value})}
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
                    candidate.language || ''
                  )}
                </TableCell>
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
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSave(candidate.id)}
                        className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      {stage === 'process' && (
                        <button
                          onClick={() => startEditing(candidate)}
                          className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded-md"
                        >
                          Edit
                        </button>
                      )}
                      <CandidateActions 
                        candidateId={candidate.id}
                        candidateName={formatName(candidate)}
                        email={candidate.email}
                        phone={candidate.phone}
                        stage={stage}
                      />
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
