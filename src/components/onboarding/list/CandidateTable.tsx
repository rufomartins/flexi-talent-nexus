import { useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";

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
  const [languages, setLanguages] = useState<{id: string, name: string}[]>([]);
  const queryClient = useQueryClient();

  // Fetch languages when component mounts
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

    // Set up realtime subscription
    const channel = supabase
      .channel('languages-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'languages' },
        () => fetchLanguages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatSource = (source: string) => {
    if (!source || source === 'new') return '';
    if (source.startsWith('http')) {
      return (
        <a 
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {new URL(source).hostname}
        </a>
      );
    }
    return source;
  };

  const startEditing = (candidate: any) => {
    setEditingId(candidate.id);
    setEditValues({
      name: candidate.name || '',
      first_name: candidate.first_name || '',
      last_name: candidate.last_name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      source: candidate.source || '',
      language: candidate.language || '',
      status: candidate.status || ''
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
          source: editValues.source || null,
          language: editValues.language || null,
          status: editValues.status || null
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Candidate information updated successfully",
      });
      
      setEditingId(null);
      setEditValues({});
      queryClient.invalidateQueries({ queryKey: ['onboarding_candidates'] });
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
                    <Command className="rounded-lg border shadow-md">
                      <CommandInput placeholder="Search languages..." />
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {languages.map((language) => (
                          <CommandItem
                            key={language.id}
                            value={language.name}
                            onSelect={() => {
                              setEditValues({...editValues, language: language.name});
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.name === editValues.language ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {language.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  ) : (
                    candidate.language || ''
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={editValues.source}
                      onChange={(e) => setEditValues({...editValues, source: e.target.value})}
                    />
                  ) : (
                    formatSource(candidate.source)
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      candidate.status
                    )}`}
                  >
                    {candidate.status.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleSave(candidate.id)}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => startEditing(candidate)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </Button>
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