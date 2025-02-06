import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateActions } from "./CandidateActions";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Candidate } from "@/types/onboarding";

interface CandidateTableProps {
  candidates: Candidate[];
  getStatusColor: (status: string) => string;
}

export function CandidateTable({ candidates, getStatusColor }: CandidateTableProps) {
  const [languages, setLanguages] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching languages:', error);
        return;
      }

      setLanguages(data || []);
    };

    fetchLanguages();
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.first_name}</TableCell>
              <TableCell>{candidate.last_name}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone}</TableCell>
              <TableCell>{candidate.language}</TableCell>
              <TableCell>{candidate.source}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getStatusColor(candidate.status)
                  )}
                >
                  {candidate.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <CandidateActions 
                  candidateId={candidate.id}
                  candidateName={candidate.name}
                  email={candidate.email}
                  phone={candidate.phone}
                  stage={candidate.stage}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}