import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SUPPORTED_LANGUAGES } from "@/utils/languages";
import { supabase } from "@/integrations/supabase/client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            
            return (
              <TableRow key={candidate.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onSelectCandidate(candidate)}
                  />
                </TableCell>
                <TableCell>
                  {isSelected ? (
                    <Input 
                      value={candidate.name || ''}
                      onChange={async (e) => {
                        try {
                          await supabase
                            .from('onboarding_candidates')
                            .update({ name: e.target.value })
                            .eq('id', candidate.id);
                        } catch (error) {
                          console.error('Error updating name:', error);
                        }
                      }}
                    />
                  ) : (
                    candidate.name
                  )}
                </TableCell>
                <TableCell>
                  {isSelected ? (
                    <Input 
                      value={candidate.first_name || ''}
                      onChange={async (e) => {
                        try {
                          await supabase
                            .from('onboarding_candidates')
                            .update({ first_name: e.target.value })
                            .eq('id', candidate.id);
                        } catch (error) {
                          console.error('Error updating first name:', error);
                        }
                      }}
                    />
                  ) : (
                    candidate.first_name
                  )}
                </TableCell>
                <TableCell>
                  {isSelected ? (
                    <Input 
                      value={candidate.last_name || ''}
                      onChange={async (e) => {
                        try {
                          await supabase
                            .from('onboarding_candidates')
                            .update({ last_name: e.target.value })
                            .eq('id', candidate.id);
                        } catch (error) {
                          console.error('Error updating last name:', error);
                        }
                      }}
                    />
                  ) : (
                    candidate.last_name
                  )}
                </TableCell>
                <TableCell>
                  {isSelected ? (
                    <Input 
                      value={candidate.email || ''}
                      onChange={async (e) => {
                        try {
                          await supabase
                            .from('onboarding_candidates')
                            .update({ email: e.target.value })
                            .eq('id', candidate.id);
                        } catch (error) {
                          console.error('Error updating email:', error);
                        }
                      }}
                    />
                  ) : (
                    candidate.email
                  )}
                </TableCell>
                <TableCell>
                  {isSelected ? (
                    <Input 
                      value={candidate.phone || ''}
                      onChange={async (e) => {
                        try {
                          await supabase
                            .from('onboarding_candidates')
                            .update({ phone: e.target.value })
                            .eq('id', candidate.id);
                        } catch (error) {
                          console.error('Error updating phone:', error);
                        }
                      }}
                    />
                  ) : (
                    candidate.phone
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={candidate.language || ""}
                    onValueChange={async (value) => {
                      try {
                        await supabase
                          .from('onboarding_candidates')
                          .update({ language: value })
                          .eq('id', candidate.id);
                      } catch (error) {
                        console.error('Error updating language:', error);
                      }
                    }}
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
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}